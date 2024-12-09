import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { formatConversationForPusher, formatMessageForPusher } from '@/lib/messageFormatter';

const prisma = new PrismaClient();

export async function sendLineMessageToUser(userId: string, content: string): Promise<boolean> {
  if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN not configured');
    return false;
  }

  const client = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET || ''
  });

  try {
    console.log('Sending LINE message:', { userId, content });
    
    let retries = 3;
    while (retries > 0) {
      try {
        await client.pushMessage(userId, {
          type: 'text',
          text: content
        });
        console.log('LINE message sent successfully');
        return true;
      } catch (error) {
        console.error(`LINE message send attempt failed (${retries} retries left):`, error);
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}

export async function handleLineMessageReceived(userId: string, content: string, messageId: string, timestamp: Date) {
  try {
    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check for existing message first
      const existingMessage = await tx.message.findFirst({
        where: {
          externalId: messageId
        }
      });

      if (existingMessage) {
        console.log('Duplicate message detected, skipping:', messageId);
        return { message: existingMessage };
      }

      let conversation = await tx.conversation.findFirst({
        where: {
          userId,
          platform: 'LINE'
        }
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            userId,
            platform: 'LINE',
            channelId: userId
          }
        });
      }

      const message = await tx.message.create({
        data: {
          conversationId: conversation.id,
          content,
          sender: 'USER',
          platform: 'LINE',
          externalId: messageId,
          timestamp
        }
      });

      await tx.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      return { message, conversationId: conversation.id };
    });

    if (!result.message) {
      console.log('No message created (likely duplicate)');
      return null;
    }

    // Get updated conversation with all messages
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: result.conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (updatedConversation) {
      // Broadcast all updates
      await Promise.all([
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.MESSAGE_RECEIVED,
          formatMessageForPusher(result.message)
        ),
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.CONVERSATION_UPDATED,
          formatConversationForPusher(updatedConversation)
        ),
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.CONVERSATIONS_UPDATED,
          (await prisma.conversation.findMany({
            include: {
              messages: {
                orderBy: { timestamp: 'asc' }
              }
            },
            orderBy: { updatedAt: 'desc' }
          })).map(formatConversationForPusher)
        )
      ]);
    }

    return result.message;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}
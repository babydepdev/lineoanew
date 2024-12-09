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
    
    await client.pushMessage(userId, {
      type: 'text',
      text: content
    });

    console.log('LINE message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}

export async function handleLineMessageReceived(
  userId: string, 
  content: string, 
  messageId: string, 
  timestamp: Date
) {
  try {
    // Check for existing message first to avoid transaction if duplicate
    const existingMessage = await prisma.message.findUnique({
      where: { externalId: messageId }
    });

    if (existingMessage) {
      console.log('Skipping duplicate message:', messageId);
      return null;
    }

    const result = await prisma.$transaction(async (tx) => {
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
        data: { updatedAt: timestamp }
      });

      return { message, conversationId: conversation.id };
    });

    if (!result) return null;

    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: result.conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (updatedConversation) {
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
        )
      ]);
    }

    return result.message;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}
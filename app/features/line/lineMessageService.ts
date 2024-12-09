import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { formatConversationForPusher } from '@/lib/messageFormatter';

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
    
    const result = await client.pushMessage(userId, {
      type: 'text',
      text: content
    });

    console.log('LINE message sent successfully:', result);
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
    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      let conversation = await tx.conversation.findFirst({
        where: {
          userId,
          platform: 'LINE'
        },
        include: {
          messages: true
        }
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            userId,
            platform: 'LINE',
            channelId: userId
          },
          include: {
            messages: true
          }
        });
      }

      // Check for duplicate message
      const existingMessage = await tx.message.findFirst({
        where: {
          OR: [
            { externalId: messageId },
            {
              conversationId: conversation.id,
              content,
              timestamp: {
                gte: new Date(timestamp.getTime() - 5000)
              }
            }
          ]
        }
      });

      if (existingMessage) {
        console.log('Duplicate message detected, skipping:', messageId);
        return { conversation, message: existingMessage };
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

      return { conversation, message };
    });

    // Get updated conversation with all messages
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: result.conversation.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (updatedConversation) {
      // Broadcast updates
      await pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formatConversationForPusher(updatedConversation)
      );

      // Broadcast all conversations update
      const allConversations = await prisma.conversation.findMany({
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      await pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATIONS_UPDATED,
        allConversations.map(formatConversationForPusher)
      );
    }

    return result.message;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}
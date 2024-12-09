import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher } from './messageFormatter';
import { LineMessageEvent } from '@/app/types/line';

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || ''
};

const prisma = new PrismaClient();
export const lineClient = new Client(lineConfig);

export async function handleLineWebhook(event: LineMessageEvent) {
  console.log('Received LINE webhook event:', JSON.stringify(event, null, 2));

  if (event.type !== 'message' || event.message.type !== 'text') {
    console.log('Skipping non-text message event');
    return;
  }

  const userId = event.source.userId;
  const text = event.message.text;
  const messageId = event.message.id;
  const timestamp = new Date(event.timestamp);
  const channelId = event.source.roomId || event.source.groupId || userId;

  try {
    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      let conversation = await tx.conversation.findFirst({
        where: {
          userId: userId,
          platform: 'LINE'
        },
        include: {
          messages: true
        }
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            userId: userId,
            platform: 'LINE',
            channelId: channelId
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
              content: text,
              timestamp: {
                gte: new Date(Date.now() - 5000)
              }
            }
          ]
        }
      });

      if (existingMessage) {
        console.log('Duplicate LINE message detected, skipping:', messageId);
        return { conversation, message: existingMessage };
      }

      const newMessage = await tx.message.create({
        data: {
          conversationId: conversation.id,
          content: text,
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

      return { conversation, message: newMessage };
    });

    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: result.conversation.id },
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
          PUSHER_EVENTS.CONVERSATION_UPDATED,
          formatConversationForPusher(updatedConversation)
        ),
        prisma.conversation.findMany({
          include: {
            messages: {
              orderBy: { timestamp: 'asc' }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }).then(conversations => 
          pusherServer.trigger(
            PUSHER_CHANNELS.CHAT,
            PUSHER_EVENTS.CONVERSATIONS_UPDATED,
            conversations.map(formatConversationForPusher)
          )
        )
      ]);
    }

    return updatedConversation;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}

export async function sendLineMessage(userId: string, message: string): Promise<boolean> {
  if (!userId || !message) {
    console.error('Missing userId or message for LINE message');
    return false;
  }

  if (!lineConfig.channelAccessToken) {
    console.error('Missing LINE channel access token');
    return false;
  }

  try {
    console.log('Attempting to send LINE message:', { userId, message });

    // Ensure LINE client is properly configured
    if (!lineClient.config.channelAccessToken) {
      throw new Error('LINE client not properly configured');
    }

    // Send message with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        const result = await lineClient.pushMessage(userId, {
          type: 'text',
          text: message
        });

        console.log('LINE message sent successfully:', {
          userId,
          message,
          result,
          timestamp: new Date().toISOString()
        });

        return true;
      } catch (error) {
        console.error(`LINE message send attempt ${4 - retries} failed:`, error);
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    }

    throw new Error('Failed to send LINE message after retries');
  } catch (error) {
    console.error('Error sending LINE message:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return false;
  }
}
import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher, formatMessageForPusher } from './messageFormatter';
import { LineMessageEvent } from '@/app/types/line';

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || ''
};

const prisma = new PrismaClient();
export const lineClient = new Client(lineConfig);

export async function handleLineWebhook(event: LineMessageEvent) {
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
    const { conversation, message } = await prisma.$transaction(async (tx) => {
      let existingConversation = await tx.conversation.findFirst({
        where: {
          userId: userId,
          platform: 'LINE'
        },
        include: {
          messages: true
        }
      });

      if (!existingConversation) {
        existingConversation = await tx.conversation.create({
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

      const existingMessage = await tx.message.findFirst({
        where: {
          OR: [
            { externalId: messageId },
            {
              conversationId: existingConversation.id,
              content: text,
              timestamp: {
                gte: new Date(Date.now() - 5000)
              }
            }
          ]
        }
      });

      if (existingMessage) {
        return { conversation: existingConversation, message: existingMessage };
      }

      const newMessage = await tx.message.create({
        data: {
          conversationId: existingConversation.id,
          content: text,
          sender: 'USER',
          platform: 'LINE',
          externalId: messageId,
          timestamp
        }
      });

      await tx.conversation.update({
        where: { id: existingConversation.id },
        data: { updatedAt: new Date() }
      });

      return { conversation: existingConversation, message: newMessage };
    });

    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
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
          formatMessageForPusher(message)
        ),
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
    console.error('Missing userId or message');
    return false;
  }

  if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN is not configured');
    return false;
  }

  try {
    console.log('Attempting to send LINE message:', { userId, message });

    // Create a new LINE client instance for each request to ensure fresh configuration
    const client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET || ''
    });

    let retries = 3;
    let lastError: Error | null = null;

    while (retries > 0) {
      try {
        const response = await client.pushMessage(userId, {
          type: 'text',
          text: message
        });

        console.log('LINE message sent successfully:', {
          userId,
          message,
          response
        });

        return true;
      } catch (error) {
        lastError = error as Error;
        console.error(`LINE message send attempt ${4 - retries} failed:`, error);
        retries--;
        
        if (retries > 0) {
          console.log(`Retrying in 1 second... (${retries} attempts remaining)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    if (lastError) {
      console.error('All LINE message send attempts failed:', {
        error: lastError.message,
        stack: lastError.stack
      });
    }

    return false;
  } catch (error) {
    console.error('Fatal error sending LINE message:', error);
    return false;
  }
}
import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher } from './messageFormatter';

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || ''
};

const prisma = new PrismaClient();
export const lineClient = new Client(lineConfig);

interface LineMessageEvent {
  type: string;
  message: {
    type: string;
    text: string;
    id: string;
  };
  source: {
    userId: string;
    roomId?: string;
    groupId?: string;
  };
  replyToken: string;
  timestamp: number;
}

export async function handleLineWebhook(event: LineMessageEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const userId = event.source.userId;
  const text = event.message.text;
  const messageId = event.message.id;
  const timestamp = new Date(event.timestamp);

  try {
    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check for duplicate message
      const existingMessage = await tx.message.findFirst({
        where: {
          externalId: messageId,
          platform: 'LINE'
        }
      });

      if (existingMessage) {
        console.log('Duplicate message detected, skipping:', messageId);
        return null;
      }

      // Find or create conversation
      let conversation = await tx.conversation.findFirst({
        where: {
          userId: userId,
          platform: 'LINE'
        }
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            userId: userId,
            platform: 'LINE',
            channelId: event.source.roomId || event.source.groupId || userId
          }
        });
      }

      // Create new message
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

      // Update conversation timestamp
      await tx.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      return { message: newMessage, conversationId: conversation.id };
    });

    if (result) {
      // Fetch updated conversation with all messages
      const updatedConversation = await prisma.conversation.findUnique({
        where: { id: result.conversationId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });

      if (updatedConversation) {
        // Broadcast both message and conversation updates
        await Promise.all([
          pusherServer.trigger(
            PUSHER_CHANNELS.CHAT,
            PUSHER_EVENTS.CONVERSATION_UPDATED,
            formatConversationForPusher(updatedConversation)
          ),
          // Also broadcast all conversations to update the list
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
    }
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}

export async function sendLineMessage(userId: string, message: string): Promise<boolean> {
  if (!userId || !message || !lineConfig.channelAccessToken) {
    console.error('Missing required parameters for LINE message:', {
      hasUserId: !!userId,
      hasMessage: !!message,
      hasToken: !!lineConfig.channelAccessToken
    });
    return false;
  }

  try {
    console.log('Sending LINE message:', {
      userId,
      message,
      timestamp: new Date().toISOString()
    });

    await lineClient.pushMessage(userId, {
      type: 'text',
      text: message
    });

    console.log('LINE message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}
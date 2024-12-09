import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { broadcastMessageUpdate } from './messageService';

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
    // Check for duplicate message
    const existingMessage = await prisma.message.findFirst({
      where: {
        externalId: messageId,
        platform: 'LINE'
      }
    });

    if (existingMessage) {
      console.log('Duplicate message detected, skipping:', messageId);
      return;
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId: userId,
        platform: 'LINE'
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: userId,
          platform: 'LINE',
          channelId: event.source.roomId || event.source.groupId || userId
        },
        include: {
          messages: true
        }
      });
    }

    // Create new message
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: text,
        sender: 'USER',
        platform: 'LINE',
        externalId: messageId,
        timestamp
      },
      include: {
        conversation: true
      }
    });

    // Get updated conversation with all messages
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (updatedConversation) {
      await broadcastMessageUpdate(conversation.id);
    }

    return { message: newMessage, conversation: updatedConversation };
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}

export async function sendLineMessage(userId: string, message: string): Promise<boolean> {
  if (!userId || !message) {
    console.error('Invalid userId or message');
    return false;
  }

  try {
    await lineClient.pushMessage(userId, {
      type: 'text',
      text: message
    });
    return true;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}
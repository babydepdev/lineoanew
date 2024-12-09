import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher } from './messageFormatter';
import { LineMessageEvent } from '@/app/types/line';

const prisma = new PrismaClient();

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
          externalId: messageId
        }
      });

      if (existingMessage) {
        console.log('Duplicate message detected, skipping:', messageId);
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

    // Get updated conversation
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

    return updatedConversation;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}

export async function sendLineMessage(userId: string, message: string): Promise<boolean> {
  if (!userId || !message || !process.env.LINE_CHANNEL_ACCESS_TOKEN) {
    console.error('Missing required parameters for LINE message');
    return false;
  }

  try {
    console.log('Sending LINE message:', { userId, message });

    const client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET || ''
    });

    let retries = 3;
    while (retries > 0) {
      try {
        await client.pushMessage(userId, {
          type: 'text',
          text: message
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
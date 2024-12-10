import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatMessageForPusher } from '../messageFormatter';
import { LineMessageEvent } from '@/app/types/line';

const prisma = new PrismaClient();

let lineClient: Client | null = null;

function getLineClient(): Client {
  if (!lineClient) {
    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN || !process.env.LINE_CHANNEL_SECRET) {
      throw new Error('LINE credentials not configured');
    }

    lineClient = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET
    });
  }

  return lineClient;
}

export async function handleLineMessageEvent(event: LineMessageEvent) {
  try {
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;
      const messageId = event.message.id;
      const content = event.message.text;
      const timestamp = new Date(event.timestamp);

      let conversation = await prisma.conversation.findFirst({
        where: {
          userId,
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
            userId,
            platform: 'LINE',
            channelId: userId
          },
          include: {
            messages: true
          }
        });
      }

      // Create message
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content,
          sender: 'BOT',
          platform: 'LINE',
          externalId: messageId,
          timestamp
        }
      });

      // Format message for Pusher
      const formattedMessage = formatMessageForPusher(message);

      // Broadcast message
      await Promise.all([
        pusherServer.trigger(
          `private-conversation-${conversation.id}`,
          PUSHER_EVENTS.MESSAGE_RECEIVED,
          formattedMessage
        ),
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.MESSAGE_RECEIVED,
          formattedMessage
        )
      ]);

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: timestamp }
      });

      return message;
    }
  } catch (error) {
    console.error('Error handling LINE message event:', error);
    throw error;
  }
}

export async function sendLineMessageToUser(userId: string, content: string): Promise<boolean> {
  try {
    console.log('Sending LINE message:', { userId, content });
    
    const client = getLineClient();
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
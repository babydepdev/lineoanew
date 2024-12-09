import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { formatConversationForPusher } from '@/lib/messageFormatter';

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

export async function handleLineMessageReceived(
  userId: string, 
  content: string, 
  messageId: string, 
  timestamp: Date
) {
  try {
    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId,
        platform: 'LINE'
      },
      include: {
        messages: true
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
        sender: 'USER',
        platform: 'LINE',
        externalId: messageId,
        timestamp
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: timestamp }
    });

    // Get updated conversation
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
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

      // Broadcast all conversations
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

    return message;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}
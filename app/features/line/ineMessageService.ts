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
    
    const response = await client.pushMessage(userId, {
      type: 'text',
      text: content
    });

    console.log('LINE message sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}

export async function handleLineMessageReceived(userId: string, content: string, messageId: string, timestamp: Date) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        userId,
        platform: 'LINE'
      },
      include: {
        messages: true
      }
    });

    if (!conversation) {
      console.error('Conversation not found for LINE user:', userId);
      return null;
    }

    // Create the message
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
      data: { updatedAt: new Date() }
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
      // Broadcast updates via Pusher
      await Promise.all([
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.CONVERSATION_UPDATED,
          formatConversationForPusher(updatedConversation)
        ),
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.CONVERSATIONS_UPDATED,
          (await prisma.conversation.findMany({
            include: { messages: true },
            orderBy: { updatedAt: 'desc' }
          })).map(formatConversationForPusher)
        )
      ]);
    }

    return message;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}
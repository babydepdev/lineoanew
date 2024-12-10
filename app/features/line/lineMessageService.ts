import { Client, ClientConfig } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer } from '@/lib/pusher';
import { PUSHER_EVENTS, PUSHER_CHANNELS } from '@/app/constants/pusher';
import { formatMessageForPusher } from '@/lib/messageFormatter';

const prisma = new PrismaClient();

let lineClient: Client | null = null;

function getLineClient(): Client {
  if (!lineClient) {
    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN || !process.env.LINE_CHANNEL_SECRET) {
      throw new Error('LINE credentials not configured');
    }

    const config: ClientConfig = {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET
    };

    lineClient = new Client(config);
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
          messages: {
            orderBy: { timestamp: 'asc' }
          }
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

    // Format message for Pusher
    const formattedMessage = formatMessageForPusher(message);

    // Broadcast message to conversation-specific channel
    await pusherServer.trigger(
      `private-conversation-${conversation.id}`,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    // Broadcast to main chat channel
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: timestamp }
    });

    // Get updated conversation with messages
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (updatedConversation) {
      // Broadcast conversation update
      await pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        updatedConversation
      );
    }

    return message;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}
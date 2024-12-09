import { PrismaClient, Message } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatConversationForPusher, formatMessageForPusher } from '../messageFormatter';

const prisma = new PrismaClient();

export async function createMessage(
  conversationId: string,
  content: string,
  sender: 'USER' | 'BOT',
  platform: 'LINE' | 'FACEBOOK',
  externalId?: string,
  timestamp?: Date
): Promise<Message> {
  return prisma.message.create({
    data: {
      conversationId,
      content,
      sender,
      platform,
      externalId,
      timestamp: timestamp || new Date()
    }
  });
}

export async function broadcastConversationUpdate(conversationId: string) {
  try {
    // Get conversation with messages
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const formattedConversation = formatConversationForPusher(conversation);

    // Broadcast to main channel
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATION_UPDATED,
      formattedConversation
    );

    // Get and broadcast latest message if exists
    const latestMessage = conversation.messages[conversation.messages.length - 1];
    if (latestMessage) {
      await pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formatMessageForPusher(latestMessage)
      );
    }

    // Get and broadcast all conversations
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

    console.log('Successfully broadcast updates for conversation:', conversationId);
  } catch (error) {
    console.error('Error broadcasting conversation update:', error);
    throw error;
  }
}
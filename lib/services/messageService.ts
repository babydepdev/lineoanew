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
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!updatedConversation) {
      console.error('Conversation not found:', conversationId);
      return;
    }

    const formattedConversation = formatConversationForPusher(updatedConversation);
    const latestMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    // Broadcast message to conversation-specific channel
    if (latestMessage) {
      await pusherServer.trigger(
        `${PUSHER_CHANNELS.CHAT}-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formatMessageForPusher(latestMessage)
      );
    }

    // Broadcast conversation update
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATION_UPDATED,
      formattedConversation
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

    console.log('Successfully broadcast updates for conversation:', conversationId);
  } catch (error) {
    console.error('Error broadcasting conversation update:', error);
    throw error;
  }
}
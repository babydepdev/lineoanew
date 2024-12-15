
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { formatConversationForPusher } from '../../messageFormatter';

const prisma = new PrismaClient();

export async function broadcastConversationUpdate(conversationId: string) {
  try {
    // Get updated conversation
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

    // Format and broadcast conversation update
    const formattedConversation = formatConversationForPusher(conversation);
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATION_UPDATED,
      formattedConversation
    );

    // Get and broadcast all conversations
    await broadcastAllConversations();

  } catch (error) {
    console.error('Error broadcasting conversation update:', error);
    throw error;
  }
}

export async function broadcastAllConversations() {
  try {
    const conversations = await prisma.conversation.findMany({
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
      conversations.map(formatConversationForPusher)
    );
  } catch (error) {
    console.error('Error broadcasting all conversations:', error);
    throw error;
  }
}

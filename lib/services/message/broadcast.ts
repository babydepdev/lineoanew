import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { MessageBroadcastResult } from './types';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(
  conversationId: string
): Promise<MessageBroadcastResult> {
  try {
    // Get conversation with messages
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    if (!conversation) {
      return {
        success: false,
        error: `Conversation not found: ${conversationId}`
      };
    }

    const latestMessage = conversation.messages[0];
    if (!latestMessage) {
      return { success: true };
    }

    // Create a unique event ID for deduplication
    const eventId = `${latestMessage.id}-${Date.now()}`;

    // Broadcast updates
    await Promise.all([
      // Broadcast message to conversation channel
      pusherServer.trigger(
        `private-conversation-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        {
          ...latestMessage,
          timestamp: latestMessage.timestamp.toISOString(),
          eventId
        }
      ),

      // Broadcast to main chat channel
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        {
          ...latestMessage,
          timestamp: latestMessage.timestamp.toISOString(),
          eventId
        }
      ),

      // Broadcast conversation update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        {
          ...conversation,
          messages: conversation.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString()
          })),
          createdAt: conversation.createdAt.toISOString(),
          updatedAt: conversation.updatedAt.toISOString()
        }
      )
    ]);

    // Get and broadcast all conversations
    const allConversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATIONS_UPDATED,
      allConversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString()
      }))
    );

    return { success: true };
  } catch (error) {
    console.error('Error broadcasting message update:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
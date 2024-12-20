import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { MessageBroadcastResult } from './types';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(
  conversationId: string
): Promise<MessageBroadcastResult> {
  try {
    // Get minimal conversation data
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        platform: true,
        userId: true,
        updatedAt: true,
        lineAccountId: true,
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            sender: true,
            timestamp: true,
            conversationId: true,
            platform: true,
            externalId: true
          }
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

    // Broadcast with event ID
    await Promise.all([
      // Broadcast just the new message
      pusherServer.trigger(
        `private-conversation-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        {
          ...latestMessage,
          timestamp: latestMessage.timestamp.toISOString(),
          eventId // Add event ID
        }
      ),

      // Broadcast minimal conversation update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        {
          id: conversation.id,
          platform: conversation.platform,
          userId: conversation.userId,
          updatedAt: conversation.updatedAt.toISOString(),
          lineAccountId: conversation.lineAccountId,
          lastMessage: {
            ...latestMessage,
            timestamp: latestMessage.timestamp.toISOString(),
            eventId // Add event ID
          }
        }
      )
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error broadcasting message update:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

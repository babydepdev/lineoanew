import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { MessageBroadcastResult } from './types';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { formatMessageForPusher } from '@/lib/messageFormatter';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(
  conversationId: string
): Promise<MessageBroadcastResult> {
  try {
    // Get conversation with limited messages
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

    // Create unique event ID for deduplication
    const eventId = `${latestMessage.id}-${Date.now()}`;

    // Broadcast updates in parallel
    await Promise.all([
      // Broadcast message to conversation channel
      pusherServer.trigger(
        `private-conversation-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        {
          ...formatMessageForPusher(latestMessage),
          eventId
        }
      ),

      // Broadcast minimal conversation update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        {
          id: conversation.id,
          updatedAt: conversation.updatedAt.toISOString(),
          lastMessage: formatMessageForPusher(latestMessage)
        }
      ),

      // Get and broadcast updated metrics
      getDashboardMetrics().then(metrics =>
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          'metrics-updated',
          metrics
        )
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

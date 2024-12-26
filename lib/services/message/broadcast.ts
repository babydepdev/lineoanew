import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { MessageBroadcastResult } from './types';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import {  formatConversationForPusher } from '@/lib/messageFormatter';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(
  conversationId: string
): Promise<MessageBroadcastResult> {
  try {
    // Get conversation with all messages and related data
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' }
        },
        lineAccount: true
      }
    });

    if (!conversation) {
      return {
        success: false,
        error: `Conversation not found: ${conversationId}`
      };
    }

    // Get all conversations for the list update
    const allConversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        lineAccount: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Broadcast updates in parallel
    await Promise.all([
      // Broadcast full conversation update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formatConversationForPusher(conversation)
      ),

      // Broadcast conversations list update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATIONS_UPDATED,
        allConversations.map(formatConversationForPusher)
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
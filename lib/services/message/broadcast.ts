import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { formatMessageForPusher, formatConversationForPusher } from '../../messageFormatter';
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
          orderBy: { timestamp: 'asc' },
          take: -50 // Get last 50 messages
        }
      }
    });

    if (!conversation) {
      return {
        success: false,
        error: `Conversation not found: ${conversationId}`
      };
    }

    const latestMessage = conversation.messages[conversation.messages.length - 1];

    // Broadcast updates in parallel
    await Promise.all([
      // Broadcast new message
      pusherServer.trigger(
        `private-conversation-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formatMessageForPusher(latestMessage)
      ),

      // Broadcast conversation update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formatConversationForPusher(conversation)
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
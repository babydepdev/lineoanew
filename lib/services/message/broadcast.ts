import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { MessageBroadcastResult } from './types';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(
  conversationId: string
): Promise<MessageBroadcastResult> {
  try {
    // Get conversation with latest message
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
            externalId: true,
            imageBase64: true
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

    // Prepare message data for broadcast
    const messageData = {
      ...latestMessage,
      timestamp: latestMessage.timestamp.toISOString()
    };

    // Broadcast to both channels simultaneously
    await Promise.all([
      // Broadcast to conversation-specific channel
      pusherServer.trigger(
        `private-conversation-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        messageData
      ),

      // Broadcast to main chat channel
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        messageData
      ),

      // Broadcast conversation update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        {
          id: conversation.id,
          platform: conversation.platform,
          userId: conversation.userId,
          updatedAt: conversation.updatedAt.toISOString(),
          lineAccountId: conversation.lineAccountId,
          lastMessage: messageData
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

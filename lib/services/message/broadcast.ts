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
            conversationId: true
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

    // Broadcast minimal data
    await Promise.all([
      // Broadcast just the new message
      pusherServer.trigger(
        `private-conversation-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        {
          id: latestMessage.id,
          content: latestMessage.content,
          sender: latestMessage.sender,
          timestamp: latestMessage.timestamp.toISOString(),
          conversationId: latestMessage.conversationId
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
            id: latestMessage.id,
            content: latestMessage.content,
            sender: latestMessage.sender,
            timestamp: latestMessage.timestamp.toISOString()
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
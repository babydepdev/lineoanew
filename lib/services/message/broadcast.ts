import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { formatMessageForPusher } from '../../messageFormatter';
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
          take: 1,
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

    const latestMessage = conversation.messages[0];
    if (!latestMessage) {
      return { success: true };
    }

    // Broadcast updates in parallel
    await Promise.all([
      // Broadcast new message
      pusherServer.trigger(
        `private-conversation-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formatMessageForPusher(latestMessage)
      ),

      // Broadcast conversation update with minimal data
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        {
          id: conversation.id,
          platform: conversation.platform,
          userId: conversation.userId,
          updatedAt: conversation.updatedAt.toISOString(),
          lineAccountId: conversation.lineAccountId,
          lineAccount: conversation.lineAccount,
          lastMessage: formatMessageForPusher(latestMessage)
        }
      ),

      // Get and broadcast all conversations list
      broadcastConversationsList()
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

async function broadcastConversationsList() {
  const conversations = await prisma.conversation.findMany({
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

  await pusherServer.trigger(
    PUSHER_CHANNELS.CHAT,
    PUSHER_EVENTS.CONVERSATIONS_UPDATED,
    conversations.map(conv => ({
      id: conv.id,
      platform: conv.platform,
      userId: conv.userId,
      updatedAt: conv.updatedAt.toISOString(),
      lineAccountId: conv.lineAccountId,
      lineAccount: conv.lineAccount,
      lastMessage: conv.messages[0] ? formatMessageForPusher(conv.messages[0]) : null
    }))
  );
}
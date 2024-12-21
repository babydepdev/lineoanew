import { pusherServer } from '@/lib/pusher';
import { PrismaClient, Conversation, Message } from '@prisma/client';
import { PUSHER_EVENTS, PUSHER_CHANNELS } from '@/app/config/constants';
import { formatConversationForPusher } from '@/lib/messageFormatter';

const prisma = new PrismaClient();

export async function broadcastConversationUpdate(conversationId: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 50
        },
        lineAccount: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!conversation) return;

    // Broadcast to conversation-specific channel
    await pusherServer.trigger(
      `private-conversation-${conversationId}`,
      PUSHER_EVENTS.CONVERSATION_UPDATED,
      formatConversationForPusher(conversation)
    );

    // Broadcast updated conversations list
    await broadcastConversationsList();
  } catch (error) {
    console.error('Error broadcasting conversation update:', error);
  }
}

export async function broadcastConversationsList() {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        lineAccount: {
          select: {
            id: true,
            name: true
          }
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
    console.error('Error broadcasting conversations list:', error);
  }
}
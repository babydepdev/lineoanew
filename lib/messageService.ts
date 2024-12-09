import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher, formatMessageForPusher } from './messageFormatter';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(conversationId: string) {
  try {
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!updatedConversation) {
      console.error('Conversation not found:', conversationId);
      return;
    }

    const latestMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
    const formattedConversation = formatConversationForPusher(updatedConversation);
    const formattedMessage = formatMessageForPusher(latestMessage);

    // Broadcast to specific conversation channel
    await pusherServer.trigger(
      `private-conversation-${conversationId}`,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    // Broadcast to main chat channel
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    // Broadcast conversation update
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATION_UPDATED,
      formattedConversation
    );

    // Update conversations list
    const allConversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATIONS_UPDATED,
      allConversations.map(formatConversationForPusher)
    );

    return updatedConversation;
  } catch (error) {
    console.error('Error broadcasting message update:', error);
    throw error;
  }
}
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher, formatMessageForPusher } from './messageFormatter';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(conversationId: string) {
  try {
    // Fetch the updated conversation with all messages
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

    // Get the latest message
    const latestMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    // Format the conversation and message for Pusher
    const formattedConversation = formatConversationForPusher(updatedConversation);
    const formattedMessage = formatMessageForPusher(latestMessage);

    // Broadcast updates
    await Promise.all([
      // Broadcast to conversation-specific channel
      pusherServer.trigger(
        `${PUSHER_CHANNELS.CHAT}-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formattedMessage
      ),
      // Broadcast to main channel
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formattedConversation
      )
    ]);

    // Fetch and broadcast all conversations for the sidebar
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

    console.log('Broadcast successful:', {
      conversationId,
      messageCount: updatedConversation.messages.length,
      latestMessage: {
        id: latestMessage.id,
        sender: latestMessage.sender,
        timestamp: latestMessage.timestamp
      }
    });

    return updatedConversation;
  } catch (error) {
    console.error('Error broadcasting message update:', error);
    throw error;
  }
}
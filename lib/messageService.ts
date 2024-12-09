import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher, formatMessageForPusher } from './messageFormatter';

const prisma = new PrismaClient();

export async function fetchLatestMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { timestamp: 'desc' },
    take: 100,
    include: {
      conversation: true,
    },
  });
}

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

    if (!updatedConversation) return;

    const formattedConversation = formatConversationForPusher(updatedConversation);
    const latestMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
    
    if (latestMessage) {
      const formattedMessage = formatMessageForPusher(latestMessage);
      
      await Promise.all([
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.MESSAGE_RECEIVED,
          formattedMessage
        ),
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.CONVERSATION_UPDATED,
          formattedConversation
        )
      ]);

      console.log('Broadcast successful:', {
        messageId: latestMessage.id,
        sender: latestMessage.sender,
        conversationId
      });
    }

    return updatedConversation;
  } catch (error) {
    console.error('Error broadcasting message update:', error);
    throw error;
  }
}
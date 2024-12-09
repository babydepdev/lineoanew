import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatConversationForPusher } from '../messageFormatter';

const prisma = new PrismaClient();

export async function createMessage(
  conversationId: string,
  content: string,
  sender: 'USER' | 'BOT',
  platform: 'LINE' | 'FACEBOOK',
  externalId?: string,
  timestamp?: Date
) {
  return prisma.message.create({
    data: {
      conversationId,
      content,
      sender,
      platform,
      externalId,
      timestamp: timestamp || new Date()
    }
  });
}

export async function broadcastConversationUpdate(conversationId: string) {
  const updatedConversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });

  if (!updatedConversation) return;

  await pusherServer.trigger(
    PUSHER_CHANNELS.CHAT,
    PUSHER_EVENTS.CONVERSATION_UPDATED,
    formatConversationForPusher(updatedConversation)
  );

  const allConversations = await prisma.conversation.findMany({
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  await pusherServer.trigger(
    PUSHER_CHANNELS.CHAT,
    PUSHER_EVENTS.CONVERSATIONS_UPDATED,
    allConversations.map(formatConversationForPusher)
  );
}
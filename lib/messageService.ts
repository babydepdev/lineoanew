import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher } from './messageFormatter';

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
  const updatedConversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });

  if (!updatedConversation) return;

  await Promise.all([
    pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATION_UPDATED,
      formatConversationForPusher(updatedConversation)
    ),
    pusherServer.trigger(
      `private-conversation-${conversationId}`,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formatConversationForPusher(updatedConversation)
    ),
  ]);

  return updatedConversation;
}
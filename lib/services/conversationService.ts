import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findOrCreateConversation(
  userId: string,
  platform: 'LINE' | 'FACEBOOK',
  channelId?: string
) {
  let conversation = await prisma.conversation.findFirst({
    where: {
      userId,
      platform
    },
    include: {
      messages: true
    }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId,
        platform,
        channelId: channelId || userId
      },
      include: {
        messages: true
      }
    });
  }

  return conversation;
}

export async function updateConversationTimestamp(
  conversationId: string,
  timestamp: Date
) {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: timestamp }
  });
}
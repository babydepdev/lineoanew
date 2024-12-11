import { PrismaClient } from '@prisma/client';
import { ConversationFindParams } from './types';

const prisma = new PrismaClient();

export async function findConversation(params: ConversationFindParams) {
  const { userId, platform, lineAccountId } = params;

  return prisma.conversation.findFirst({
    where: {
      userId,
      platform,
      ...(lineAccountId && { lineAccountId })
    },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });
}
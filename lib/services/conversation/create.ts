import { PrismaClient } from '@prisma/client';
import { ConversationCreateParams } from './types';

const prisma = new PrismaClient();

export async function createConversation(params: ConversationCreateParams) {
  const { userId, platform, channelId, lineAccountId } = params;

  return prisma.conversation.create({
    data: {
      userId,
      platform,
      channelId,
      lineAccountId
    },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });
}
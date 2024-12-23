import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ConversationCountResult {
  lineAccountId: string;
  _count: {
    _all: number;
  };
}

export async function getConversationsByLineAccount(): Promise<ConversationCountResult[]> {
  const result = await prisma.conversation.groupBy({
    by: ['lineAccountId'] as const,
    _count: {
      _all: true
    },
    where: {
      lineAccountId: { 
        not: null 
      }
    }
  });

  // Filter out null lineAccountIds and cast to required type
  return result.filter((item): item is ConversationCountResult => 
    item.lineAccountId !== null
  );
}

export async function getConversationCount(lineAccountId: string): Promise<number> {
  return prisma.conversation.count({
    where: {
      lineAccountId
    }
  });
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getMessagesByAccount(lineAccountId: string): Promise<number> {
  const result = await prisma.message.count({
    where: {
      conversation: {
        lineAccountId
      }
    }
  });
  
  return result;
}

export async function getTotalMessageCount(): Promise<number> {
  return prisma.message.count({
    where: {
      conversation: {
        lineAccountId: { 
          not: null 
        }
      }
    }
  });
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getQuotations(lineAccountId: string) {
  return prisma.quotation.findMany({
    where: {
      lineAccountId
    },
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
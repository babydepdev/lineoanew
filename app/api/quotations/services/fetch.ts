import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchQuotationsByAccount(accountId: string) {
  return prisma.quotation.findMany({
    where: {
      lineAccountId: accountId
    },
    include: {
      items: {
        orderBy: {
          id: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
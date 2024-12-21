import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTotalQuotations(): Promise<number> {
  return prisma.quotation.count();
}

export async function getQuotationsByAccount(accountId: string): Promise<number> {
  return prisma.quotation.count({
    where: {
      lineAccountId: accountId
    }
  });
}
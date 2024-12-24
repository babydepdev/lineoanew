import { PrismaClient } from '@prisma/client';
import { QuotationFindResult } from './types';

const prisma = new PrismaClient();

export async function findQuotationsByAccount(accountId: string): Promise<QuotationFindResult> {
  try {
    const quotations = await prisma.quotation.findMany({
      where: {
        lineAccountId: accountId
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      quotations
    };
  } catch (error) {
    console.error('Error finding quotations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to find quotations'
    };
  }
}
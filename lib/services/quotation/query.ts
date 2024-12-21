import { PrismaClient } from '@prisma/client';
import { QuotationQueryOptions, QuotationQueryResult, QuotationWithItems } from './types';
import { quotationCache } from './cache';

const prisma = new PrismaClient();
const DEFAULT_LIMIT = 20;

export async function getQuotationsByAccount(
  options: QuotationQueryOptions
): Promise<QuotationQueryResult> {
  try {
    // Check cache first
    const cached = quotationCache.get(options.accountId);
    if (cached) {
      return {
        success: true,
        data: cached
      };
    }

    const quotations = await prisma.quotation.findMany({
      where: { 
        lineAccountId: options.accountId 
      },
      include: { 
        items: options.includeItems ?? true
      },
      orderBy: { 
        createdAt: 'desc' 
      },
      take: options.limit ?? DEFAULT_LIMIT
    }) as QuotationWithItems[]; // Cast to correct type since Prisma includes items

    // Cache results
    quotationCache.set(options.accountId, quotations);

    return {
      success: true,
      data: quotations
    };
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
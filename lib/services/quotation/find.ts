import { prisma } from '@/lib/prisma';
import { QuotationFindResult } from './types/results';
import { QuotationWithItems, PaginationMetadata } from './types/models';

const DEFAULT_PAGE_SIZE = 20;

export async function findQuotationsByAccount(
  accountId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<QuotationFindResult> {
  try {
    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Run count and find in parallel
    const [total, quotations] = await Promise.all([
      prisma.quotation.count({
        where: { lineAccountId: accountId }
      }),
      prisma.quotation.findMany({
        where: { lineAccountId: accountId },
        include: {
          items: {
            select: {
              id: true,
              name: true,
              quantity: true,
              price: true,
              total: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / pageSize);
    const hasMore = page < totalPages;

    const paginationData: PaginationMetadata = {
      page,
      pageSize,
      total,
      totalPages,
      hasMore
    };

    return {
      success: true,
      quotations: quotations as QuotationWithItems[],
      pagination: paginationData
    };
  } catch (error) {
    console.error('Error finding quotations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to find quotations'
    };
  }
}

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const quotationCache = new Map<string, { data: QuotationWithItems; timestamp: number }>();

export async function findQuotationById(id: string): Promise<QuotationWithItems | null> {
  // Check cache first
  const cached = quotationCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
          price: true,
          total: true
        }
      }
    }
  });

  if (quotation) {
    // Update cache
    quotationCache.set(id, {
      data: quotation as QuotationWithItems,
      timestamp: Date.now()
    });
  }

  return quotation as QuotationWithItems | null;
}
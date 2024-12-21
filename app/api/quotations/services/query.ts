import { PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';

const prisma = new PrismaClient();

// Cache configuration
const CACHE_TAG = 'quotations';
const CACHE_REVALIDATE_SECONDS = 10;

// Helper function to generate cache key
const generateCacheKey = (accountId: string) => `quotations:${accountId}`;

// Optimized query function with caching
export const getQuotations = unstable_cache(
  async (accountId: string) => {
    return prisma.quotation.findMany({
      where: {
        lineAccountId: accountId
      },
      select: {
        id: true,
        number: true, 
        customerName: true,
        total: true,
        createdAt: true,
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
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit results for better performance
    });
  },
  // Use string array for cache keys instead of function
  ['quotations'],
  {
    tags: [CACHE_TAG],
    revalidate: CACHE_REVALIDATE_SECONDS
  }
);
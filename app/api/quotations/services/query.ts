import { PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';

const prisma = new PrismaClient();

// Cache configuration
const CACHE_TAG = 'quotations';
const CACHE_REVALIDATE_SECONDS = 10;

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
  [`quotations:list`], // Use a simple static cache key
  {
    tags: [CACHE_TAG],
    revalidate: CACHE_REVALIDATE_SECONDS
  }
);
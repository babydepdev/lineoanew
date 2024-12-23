import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedQuotations, cacheQuotations } from '@/lib/services/quotation/cache';

import { CachedQuotation } from '@/lib/services/quotation/cache/types';

export async function handleGetQuotations(accountId: string) {
  try {
    // Try to get from cache first
    const cachedQuotations = await getCachedQuotations(accountId);
    if (cachedQuotations) {
      return NextResponse.json(cachedQuotations);
    }

    // If not in cache, fetch from database with items included
    const quotations = await prisma.quotation.findMany({
      where: { lineAccountId: accountId },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform quotations to match CachedQuotation type
    const cachedFormat: CachedQuotation[] = quotations.map(quotation => ({
      id: quotation.id,
      number: quotation.number,
      customerName: quotation.customerName,
      total: quotation.total,
      status: quotation.status,
      createdAt: quotation.createdAt,
      updatedAt: quotation.updatedAt,
      lineAccountId: quotation.lineAccountId,
      invoiceId: quotation.invoiceId,
      items: quotation.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    }));

    // Cache the transformed results
    await cacheQuotations(accountId, cachedFormat);

    return NextResponse.json(cachedFormat);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}
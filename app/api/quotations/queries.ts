import { Prisma } from '@prisma/client';

export function getQuotationsQuery(accountId: string): Prisma.QuotationFindManyArgs {
  return {
    where: { lineAccountId: accountId },
    select: {
      id: true,
      number: true,
      customerName: true,
      total: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      lineAccountId: true,
      invoiceId: true,
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
    take: 50 // Limit results for better performance
  };
}
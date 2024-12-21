import { PrismaClient } from '@prisma/client';
import { QuotationCreateParams } from './types';

const prisma = new PrismaClient();

export async function createQuotation(params: QuotationCreateParams) {
  const { lineAccountId, customerName, items } = params;

  // Calculate totals once
  const processedItems = items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.quantity * item.price
  }));

  const total = processedItems.reduce((sum, item) => sum + item.total, 0);

  // Use a single transaction for atomic operation
  return prisma.$transaction(async (tx) => {
    const quotation = await tx.quotation.create({
      data: {
        number: `QT${Date.now()}`,
        customerName,
        total,
        lineAccountId,
        items: {
          create: processedItems
        }
      },
      include: {
        items: true
      }
    });

    return quotation;
  }, {
    timeout: 5000 // 5 second timeout
  });
}
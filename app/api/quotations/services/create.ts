import { PrismaClient } from '@prisma/client';
import { QuotationCreateParams } from './types';

const prisma = new PrismaClient({
  // Increase transaction timeout
  transactionOptions: {
    timeout: 10000 // 10 seconds
  }
});

export async function createQuotation(params: QuotationCreateParams) {
  const { customerName, lineAccountId, items, total, number } = params;
  
  // Create quotation first
  const quotation = await prisma.quotation.create({
    data: {
      number,
      customerName,
      total,
      lineAccountId
    }
  });

  // Then create items in batches
  const batchSize = 10;
  const itemBatches = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    itemBatches.push(
      prisma.quotationItem.createMany({
        data: batch.map(item => ({
          quotationId: quotation.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      })
    );
  }

  // Execute item creation in parallel
  await Promise.all(itemBatches);

  // Return complete quotation with items
  return prisma.quotation.findUnique({
    where: { id: quotation.id },
    include: { items: true }
  });
}
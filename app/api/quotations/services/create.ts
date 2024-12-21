import { PrismaClient } from '@prisma/client';
import { QuotationCreateParams } from '@/lib/services/quotation/types';
import { broadcastQuotationUpdate } from './broadcast';

const prisma = new PrismaClient();

export async function createQuotationWithItems(params: QuotationCreateParams) {
  const quotation = await prisma.quotation.create({
    data: {
      number: params.number,
      customerName: params.customerName,
      total: params.total,
      lineAccountId: params.lineAccountId,
      items: {
        create: params.items
      }
    },
    include: {
      items: true
    }
  });

  await broadcastQuotationUpdate(quotation);
  return quotation;
}
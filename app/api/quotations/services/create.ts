import { PrismaClient } from '@prisma/client';
import { QuotationCreateParams } from './types';

const prisma = new PrismaClient();

export async function createQuotation(params: QuotationCreateParams) {
  const { customerName, lineAccountId, items, total, number } = params;
  
  return prisma.quotation.create({
    data: {
      number,
      customerName,
      total,
      lineAccountId,
      items: {
        create: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      }
    },
    include: {
      items: true
    }
  });
}
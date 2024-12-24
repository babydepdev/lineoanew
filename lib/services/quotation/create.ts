import { PrismaClient } from '@prisma/client';
import { QuotationCreateParams, QuotationCreateResult } from './types';
import { generateQuotationNumber } from './utils';

const prisma = new PrismaClient();

export async function createQuotation(params: QuotationCreateParams): Promise<QuotationCreateResult> {
  try {
    const quotation = await prisma.$transaction(async (tx) => {
      // Generate quotation number
      const number = await generateQuotationNumber();

      // Calculate total
      const total = params.items.reduce((sum, item) => 
        sum + (item.quantity * item.price), 0
      );

      // Create quotation with items
      return tx.quotation.create({
        data: {
          number,
          customerName: params.customerName,
          total,
          lineAccountId: params.lineAccountId,
          items: {
            create: params.items.map(item => ({
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
    }, {
      timeout: 5000
    });

    return {
      success: true,
      quotation
    };
  } catch (error) {
    console.error('Error creating quotation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create quotation'
    };
  }
}
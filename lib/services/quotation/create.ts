import { prisma } from '@/lib/prisma';
import { QuotationCreateParams, QuotationCreateResult } from './types';
import { generateQuotationNumber } from './utils/number';
import { validateQuotationItems } from './utils/validation';
import { calculateQuotationTotal } from './utils/calculation';

export async function createQuotation(params: QuotationCreateParams): Promise<QuotationCreateResult> {
  try {
    // Validate items first to fail fast
    if (!validateQuotationItems(params.items)) {
      return {
        success: false,
        error: 'Invalid quotation items'
      };
    }

    // Use Promise.all for parallel operations
    const [number, total] = await Promise.all([
      generateQuotationNumber(),
      Promise.resolve(calculateQuotationTotal(params.items))
    ]);

    // Create quotation and items in a single transaction
    const quotation = await prisma.$transaction(async (tx) => {
      const newQuotation = await tx.quotation.create({
        data: {
          number,
          customerName: params.customerName,
          total,
          lineAccountId: params.lineAccountId,
          items: {
            createMany: {
              data: params.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price
              }))
            }
          }
        },
        include: {
          items: true
        }
      });

      return newQuotation;
    }, {
      timeout: 10000, // 10 second timeout
      maxWait: 5000 // 5 second max wait for transaction
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
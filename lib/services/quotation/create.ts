import { prisma } from '@/lib/prisma';
import { QuotationCreateParams, QuotationCreateResult } from './types';
import { 
  generateQuotationNumber, 
  validateQuotationItems, 
  calculateQuotationTotal 
} from './utils';

export async function createQuotation(params: QuotationCreateParams): Promise<QuotationCreateResult> {
  try {
    // Validate items
    if (!validateQuotationItems(params.items)) {
      return {
        success: false,
        error: 'Invalid quotation items'
      };
    }

    // Generate number and calculate total
    const number = await generateQuotationNumber();
    const total = calculateQuotationTotal(params.items);

    const quotation = await prisma.quotation.create({
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
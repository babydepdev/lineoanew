import { PrismaClient } from '@prisma/client';
import { QuotationUpdateParams, QuotationUpdateResult } from './types';

const prisma = new PrismaClient();

export async function updateQuotation(
  id: string, 
  params: QuotationUpdateParams
): Promise<QuotationUpdateResult> {
  try {
    const quotation = await prisma.$transaction(async (tx) => {
      // Delete existing items
      await tx.quotationItem.deleteMany({
        where: { quotationId: id }
      });

      // Calculate new total
      const total = params.items.reduce((sum, item) => 
        sum + (item.quantity * item.price), 0
      );

      // Update quotation and create new items
      return tx.quotation.update({
        where: { id },
        data: {
          customerName: params.customerName,
          total,
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
    console.error('Error updating quotation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update quotation'
    };
  }
}
import { prisma } from '@/lib/prisma';
import { QuotationDeleteResult } from './types';

export async function deleteQuotation(id: string): Promise<QuotationDeleteResult> {
  try {
    await prisma.$transaction([
      // Delete items first due to foreign key constraint
      prisma.quotationItem.deleteMany({
        where: { quotationId: id }
      }),
      // Then delete the quotation
      prisma.quotation.delete({
        where: { id }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete quotation'
    };
  }
}
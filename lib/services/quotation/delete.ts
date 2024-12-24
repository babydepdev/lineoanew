import { PrismaClient } from '@prisma/client';
import { QuotationDeleteResult } from './types';

const prisma = new PrismaClient();

export async function deleteQuotation(id: string): Promise<QuotationDeleteResult> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.quotationItem.deleteMany({ where: { quotationId: id } });
      await tx.quotation.delete({ where: { id } });
    }, {
      timeout: 5000
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete quotation'
    };
  }
}
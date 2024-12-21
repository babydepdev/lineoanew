import { PrismaClient } from '@prisma/client';
import { broadcastQuotationDelete } from './broadcast';

const prisma = new PrismaClient();

interface DeleteQuotationResult {
  success: boolean;
  error?: string;
}

export async function deleteQuotation(id: string): Promise<DeleteQuotationResult> {
  try {
    // Use transaction to ensure both operations succeed or fail together
    const deletedQuotation = await prisma.$transaction(async (tx) => {
      // Delete items first
      await tx.quotationItem.deleteMany({
        where: { quotationId: id }
      });

      // Then delete quotation
      return tx.quotation.delete({
        where: { id }
      });
    });

    // Broadcast deletion with updated metrics
    await broadcastQuotationDelete(deletedQuotation);

    return { success: true };
  } catch (error) {
    console.error('Error in deleteQuotation service:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete quotation'
    };
  }
}
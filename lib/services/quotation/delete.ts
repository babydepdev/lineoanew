import { PrismaClient } from '@prisma/client';
import { broadcastQuotationUpdate } from './broadcast';
import { QuotationResult } from './types';

const prisma = new PrismaClient({
  log: ['query'],
  errorFormat: 'minimal'
});

export async function deleteQuotation(id: string): Promise<QuotationResult> {
  try {
    // Delete quotation directly - cascade delete will handle items
    await prisma.quotation.delete({
      where: { id }
    });

    // Broadcast updates asynchronously - don't wait for completion
    broadcastQuotationUpdate('deleted', id).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error('Error in deleteQuotation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete quotation'
    };
  }
}
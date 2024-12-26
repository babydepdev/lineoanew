import { prisma } from '@/lib/prisma';
import { QuotationCreateParams, QuotationCreateResult } from './types';
import { generateQuotationNumber } from './utils/number';
import { validateQuotationItems } from './utils/validation';
import { calculateQuotationTotal } from './utils/calculation';
import { batchProcessor } from './batch/processor';
import { quotationCache } from './cache/store';

export async function createQuotation(params: QuotationCreateParams): Promise<QuotationCreateResult> {
  try {
    // Validate items first to fail fast
    if (!validateQuotationItems(params.items)) {
      return {
        success: false,
        error: 'Invalid quotation items'
      };
    }

    // Prepare data in parallel
    const [number, total] = await Promise.all([
      generateQuotationNumber(),
      Promise.resolve(calculateQuotationTotal(params.items))
    ]);

    // Create quotation first
    const quotation = await prisma.quotation.create({
      data: {
        number,
        customerName: params.customerName,
        total,
        lineAccountId: params.lineAccountId
      }
    });

    // Add items in batches asynchronously
    await batchProcessor.addItems(params.items, quotation.id);

    // Fetch complete quotation with items
    const completeQuotation = await prisma.quotation.findUnique({
      where: { id: quotation.id },
      include: { items: true }
    });

    if (!completeQuotation) {
      throw new Error('Failed to fetch created quotation');
    }

    // Update cache
    quotationCache.set(`quotation:${quotation.id}`, completeQuotation);
    quotationCache.invalidatePattern(new RegExp(`quotations:${params.lineAccountId}`));

    return {
      success: true,
      quotation: completeQuotation
    };
  } catch (error) {
    console.error('Error creating quotation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create quotation'
    };
  }
}
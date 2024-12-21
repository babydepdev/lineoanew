import { PrismaClient } from '@prisma/client';
import { QuotationCreateParams, QuotationResult } from './types';

const prisma = new PrismaClient();

export async function createQuotation(params: QuotationCreateParams): Promise<QuotationResult> {
  try {
    const quotation = await prisma.quotation.create({
      data: {
        number: params.number,
        customerName: params.customerName,
        total: params.total,
        lineAccountId: params.lineAccountId,
        items: {
          create: params.items
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
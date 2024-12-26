import { QuotationItem } from '../types/models';
import { prisma } from '@/lib/prisma';

interface BatchOperation<T> {
  operation: 'create' | 'update' | 'delete';
  data: T;
}

export class QuotationBatchProcessor {
  private batchSize: number;
  private operations: BatchOperation<any>[] = [];

  constructor(batchSize = 100) {
    this.batchSize = batchSize;
  }

  async addItems(items: QuotationItem[], quotationId: string): Promise<void> {
    const batches = this.chunkArray(items, this.batchSize);
    
    for (const batch of batches) {
      await prisma.quotationItem.createMany({
        data: batch.map(item => ({
          ...item,
          quotationId,
          total: item.quantity * item.price
        }))
      });
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const batchProcessor = new QuotationBatchProcessor();
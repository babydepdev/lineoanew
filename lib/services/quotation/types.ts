import { Quotation, QuotationItem } from '@prisma/client';

export interface QuotationWithItems extends Quotation {
  items: QuotationItem[];
}

export interface QuotationQueryOptions {
  accountId: string;
  limit?: number;
  includeItems?: boolean;
}

export interface QuotationQueryResult {
  success: boolean;
  data: QuotationWithItems[];
  error?: string;
}
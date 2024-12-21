import { QuotationItem } from '@prisma/client';

export interface QuotationCreateParams {
  number: string;
  customerName: string;
  total: number;
  lineAccountId: string;
  items: Omit<QuotationItem, 'id' | 'quotationId'>[];
}

export interface QuotationResult {
  success: boolean;
  quotation?: any; // Using any temporarily, should be properly typed
  error?: string;
}
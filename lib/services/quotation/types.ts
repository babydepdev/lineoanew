import { QuotationItem } from '@prisma/client';

export interface QuotationCreateParams {
  customerName: string;
  lineAccountId: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface QuotationCreateResult {
  success: boolean;
  quotation?: any;
  error?: string;
}

export interface QuotationFindResult {
  success: boolean;
  quotations?: any[];
  error?: string;
}

export interface QuotationUpdateParams {
  customerName: string;
  items: QuotationItem[];
}

export interface QuotationUpdateResult {
  success: boolean;
  quotation?: any;
  error?: string;
}

export interface QuotationDeleteResult {
  success: boolean;
  error?: string;
}
import { QuotationWithItems } from './models';
import { PaginationMetadata } from './models';

export interface QuotationFindResult {
  success: boolean;
  quotations?: QuotationWithItems[];
  pagination?: PaginationMetadata;
  error?: string;
}

export interface QuotationCreateResult {
  success: boolean;
  quotation?: QuotationWithItems;
  error?: string;
}

export interface QuotationUpdateResult {
  success: boolean;
  quotation?: QuotationWithItems;
  error?: string;
}

export interface QuotationDeleteResult {
  success: boolean;
  error?: string;
}
import { QuotationItem } from './models';

export interface QuotationCreateParams {
  customerName: string;
  lineAccountId: string;
  items: QuotationItem[];
}

export interface QuotationUpdateParams {
  customerName: string;
  items: QuotationItem[];
}

export interface QuotationFindParams {
  accountId: string;
  page?: number;
  pageSize?: number;
}
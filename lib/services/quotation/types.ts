export interface QuotationItem {
  name: string;
  quantity: number;
  price: number;
}

export interface QuotationUpdateParams {
  customerName: string;
  items: QuotationItem[];
}

export interface QuotationUpdateResult {
  success: boolean;
  quotation?: any; // Type this properly based on your Prisma schema
  error?: string;
}

export interface QuotationDeleteResult {
  success: boolean;
  error?: string;
}
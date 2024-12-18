export interface QuotationItem {
  id?: string; // Optional for new items
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface QuotationFormItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Quotation {
  id: string;
  number: string;
  customerName: string;
  items: QuotationItem[];
  total: number;
  createdAt: Date;
  lineAccountId: string;
}

export interface QuotationFormData {
  customerName: string;
  items: QuotationFormItem[];
}
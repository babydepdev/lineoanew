export interface QuotationItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
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
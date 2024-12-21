export interface QuotationItem {
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface QuotationCreateParams {
    number: string;
    customerName: string;
    lineAccountId: string;
    total: number;
    items: QuotationItem[];
  }
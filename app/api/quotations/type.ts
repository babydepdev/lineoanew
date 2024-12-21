export interface QuotationItem {
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface QuotationCreateParams {
    lineAccountId: string;
    customerName: string;
    items: QuotationItem[];
  }
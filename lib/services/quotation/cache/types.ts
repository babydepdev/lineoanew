import { DocumentStatus } from '@prisma/client';

export interface CachedQuotation {
  id: string;
  number: string;
  customerName: string;
  total: number;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  lineAccountId: string;
  invoiceId: string | null;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}
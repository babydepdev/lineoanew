// Base types for quotation items and metadata
export interface QuotationItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface QuotationWithItems {
  id: string;
  number: string;
  customerName: string;
  total: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  lineAccountId: string;
  items: QuotationItem[];
}

// Pagination related types
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMetadata;
}
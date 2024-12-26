import { QuotationItem } from "../types/models";

// Optimized calculation using reduce
export function calculateQuotationTotal(items: QuotationItem[]): number {
  return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
}

// Batch calculation for multiple quotations
export function calculateBatchTotals(itemsBatch: QuotationItem[][]): number[] {
  return itemsBatch.map(items => calculateQuotationTotal(items));
}

// Calculate item subtotals
export function calculateItemSubtotals(items: QuotationItem[]): number[] {
  return items.map(item => item.quantity * item.price);
}
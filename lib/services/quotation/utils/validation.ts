import { QuotationItem } from "../types/models";

const ITEM_CONSTRAINTS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 200,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 9999,
  MIN_PRICE: 0,
  MAX_PRICE: 9999999.99
} as const;

export function validateQuotationItems(items: QuotationItem[]): boolean {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  return items.every(validateSingleItem);
}

function validateSingleItem(item: QuotationItem): boolean {
  // Validate name
  if (!item.name ||
      typeof item.name !== 'string' ||
      item.name.length < ITEM_CONSTRAINTS.NAME_MIN_LENGTH ||
      item.name.length > ITEM_CONSTRAINTS.NAME_MAX_LENGTH) {
    return false;
  }

  // Validate quantity
  if (!Number.isInteger(item.quantity) ||
      item.quantity < ITEM_CONSTRAINTS.MIN_QUANTITY ||
      item.quantity > ITEM_CONSTRAINTS.MAX_QUANTITY) {
    return false;
  }

  // Validate price
  if (typeof item.price !== 'number' ||
      item.price < ITEM_CONSTRAINTS.MIN_PRICE ||
      item.price > ITEM_CONSTRAINTS.MAX_PRICE) {
    return false;
  }

  return true;
}

export function validateQuotationTotal(total: number): boolean {
  return typeof total === 'number' && 
         total >= 0 && 
         total <= ITEM_CONSTRAINTS.MAX_PRICE * ITEM_CONSTRAINTS.MAX_QUANTITY;
}
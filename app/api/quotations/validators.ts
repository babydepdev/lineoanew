import { NextResponse } from 'next/server';
import { QuotationCreateParams } from './services/types';

export function validateAccountId(accountId: string | null) {
  if (!accountId) {
    return NextResponse.json(
      { error: 'Account ID is required' },
      { status: 400 }
    );
  }
  return null;
}

export function validateQuotationData(data: Partial<QuotationCreateParams>) {
  const { customerName, lineAccountId, items } = data;

  if (!customerName || !lineAccountId || !items?.length) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  if (!items.every(item => item.name && item.quantity > 0 && item.price >= 0)) {
    return NextResponse.json(
      { error: 'Invalid item data' },
      { status: 400 }
    );
  }

  return null;
}
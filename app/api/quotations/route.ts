import { NextRequest, NextResponse } from 'next/server';
import { createQuotation } from './services/create';
import { getQuotations } from './services/get';
import { validateQuotation } from './validators';
import { broadcastQuotationUpdate } from '@/lib/services/quotation/broadcast';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Missing accountId parameter' },
        { status: 400 }
      );
    }

    const quotations = await getQuotations(accountId);
    return NextResponse.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = validateQuotation(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const quotation = await createQuotation(body);
    broadcastQuotationUpdate('created', quotation.id).catch(console.error);

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
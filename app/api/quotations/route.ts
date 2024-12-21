import { NextRequest, NextResponse } from 'next/server';
import { getQuotationsByAccount } from '@/lib/services/quotation/query';
import { createQuotation } from '@/lib/services/quotation/create';
import { broadcastQuotationUpdate } from '@/lib/services/quotation/broadcast';
import { validateQuotationRequest } from '@/lib/services/quotation/validate';
import { quotationCache } from '@/lib/services/quotation/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const result = await getQuotationsByAccount({
      accountId,
      limit: 20,
      includeItems: true
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data, {
      headers: {
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

// POST handler remains the same...

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = validateQuotationRequest(body.lineAccountId, body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create quotation
    const result = await createQuotation(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Clear cache for this account
    quotationCache.delete(body.lineAccountId);

    // Broadcast update
    await broadcastQuotationUpdate(result.quotation);

    return NextResponse.json(result.quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
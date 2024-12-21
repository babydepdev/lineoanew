import { NextRequest, NextResponse } from 'next/server';
import { getQuotations } from '../services/query';
import { validateAccountId } from '../validators';

export async function handleGetQuotations(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    // Validate account ID
    const validationError = validateAccountId(accountId);
    if (validationError) {
      return validationError;
    }

    // Fetch quotations
    const quotations = await getQuotations(accountId!);

    // Return response with cache headers
    return new NextResponse(JSON.stringify(quotations), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=10, stale-while-revalidate=30'
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
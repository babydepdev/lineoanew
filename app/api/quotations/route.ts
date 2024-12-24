import { NextRequest, NextResponse } from 'next/server';
import { pusherServer, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { findQuotationsByAccount } from '@/lib/services/quotation/find';
import { createQuotation } from '@/lib/services/quotation/create';

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

    const result = await findQuotationsByAccount(accountId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.quotations);
  } catch (error) {
    console.error('Error in GET endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineAccountId, customerName, items } = body;

    // Validate required fields
    if (!lineAccountId || !customerName || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await createQuotation({
      lineAccountId,
      customerName,
      items
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Handle updates in parallel
    const [metrics] = await Promise.all([
      getDashboardMetrics(),
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        'quotation-created',
        { quotation: result.quotation }
      )
    ]);

    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      'metrics-updated',
      metrics
    );

    return NextResponse.json(result.quotation);
  } catch (error) {
    console.error('Error in POST endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
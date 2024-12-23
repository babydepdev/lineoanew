import { NextResponse } from 'next/server';
import { pusherServer, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { createQuotation } from '@/lib/services/quotation/create';
import { invalidateQuotationsCache } from '@/lib/services/quotation/cache';
import { QuotationCreateParams } from '@/lib/services/quotation/types';

export async function handleCreateQuotation(params: QuotationCreateParams) {
  try {
    // Create quotation
    const result = await createQuotation(params);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Invalidate cache
    await invalidateQuotationsCache(params.lineAccountId);

    // Get updated metrics
    const metrics = await getDashboardMetrics();

    // Broadcast updates
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      'metrics-updated',
      metrics
    );

    return NextResponse.json(result.quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
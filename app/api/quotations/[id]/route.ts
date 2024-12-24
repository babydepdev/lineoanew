import { NextRequest, NextResponse } from 'next/server';
import { pusherServer, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { deleteQuotation } from '@/lib/services/quotation/delete';
import { updateQuotation } from '@/lib/services/quotation/update';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const result = await deleteQuotation(id);

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
        'quotation-deleted',
        { quotationId: id }
      )
    ]);

    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      'metrics-updated',
      metrics
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process delete request' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const result = await updateQuotation(id, {
      customerName: body.customerName,
      items: body.items
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
        'quotation-updated',
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
    console.error('Error in patch endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process update request' },
      { status: 500 }
    );
  }
}
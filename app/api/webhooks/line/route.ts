import { NextRequest, NextResponse } from 'next/server';
import { LineWebhookBody } from '@/app/types/line';
import { validateWebhookRequest } from '@/lib/services/line/webhook/validate';
import { processWebhookEvents } from '@/lib/services/line/webhook/process';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    console.log('Received LINE webhook:', rawBody);

    // Get signature from headers
    const signature = request.headers.get('x-line-signature');
    
    // Validate webhook request
    const validation = await validateWebhookRequest(rawBody, signature);
    if (!validation.isValid || !validation.account) {
      console.error('Invalid webhook request:', validation.error);
      return NextResponse.json(
        { error: validation.error || 'Invalid request' },
        { status: 401 }
      );
    }

    // Parse webhook body
    let webhookBody: LineWebhookBody;
    try {
      webhookBody = JSON.parse(rawBody);
    } catch (error) {
      console.error('Invalid webhook body:', error);
      return NextResponse.json(
        { error: 'Invalid webhook body' },
        { status: 400 }
      );
    }

    // Process webhook events
    const result = await processWebhookEvents(webhookBody, validation.account);

    console.log('Webhook processing result:', result);

    return NextResponse.json({
      message: 'Processed LINE webhook',
      processed: result.processed,
      total: result.total
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
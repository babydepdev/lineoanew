import { NextRequest, NextResponse } from 'next/server';
import { LineWebhookBody } from '@/app/types/line';
import { 
  findLineAccountBySignature,
  extractLineSignature,
  processLineWebhook 
} from '@/lib/services/line';

export async function POST(request: NextRequest) {
  try {
    // Get raw body and signature
    const rawBody = await request.text();
    console.log('Received LINE webhook:', rawBody);

    const signature = extractLineSignature(
      request.headers.get('x-line-signature')
    );

    if (!signature) {
      console.error('Missing LINE signature header');
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
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

    // Verify signature and get account
    const verificationResult = await findLineAccountBySignature(rawBody, signature);
    
    if (!verificationResult?.isValid || !verificationResult.account) {
      console.error('Invalid signature or no matching account');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Process webhook events
    const result = await processLineWebhook(webhookBody, verificationResult.account);
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
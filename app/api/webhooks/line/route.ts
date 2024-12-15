import { NextRequest, NextResponse } from 'next/server';
import { LineWebhookBody } from '@/app/types/line';
import { 
  findLineAccountBySignature,
  extractLineSignature,
  processLineWebhook 
} from '@/lib/services/line';
import { broadcastAllConversations } from '@/lib/services/conversation/broadcast';

export async function POST(request: NextRequest) {
  try {
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

    const verificationResult = await findLineAccountBySignature(rawBody, signature);
    
    if (!verificationResult?.isValid || !verificationResult.account) {
      console.error('Invalid signature or no matching account');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const result = await processLineWebhook(webhookBody, verificationResult.account);
    
    // Broadcast all conversations after webhook processing
    await broadcastAllConversations();

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
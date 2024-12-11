import { NextRequest, NextResponse } from 'next/server';
import { LineWebhookBody } from '@/app/types/line';
import { 
  findLineAccountBySignature,
  extractLineSignature,
  processLineWebhook 
} from '@/lib/services/line';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = extractLineSignature(request.headers.get('x-line-signature'));

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    let webhookBody: LineWebhookBody;
    try {
      webhookBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const verificationResult = await findLineAccountBySignature(rawBody, signature);
    if (!verificationResult?.isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const result = await processLineWebhook(webhookBody, verificationResult.account);

    return NextResponse.json({
      message: 'Processed LINE webhook',
      ...result
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
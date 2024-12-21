import { NextRequest, NextResponse } from 'next/server';
import { LineWebhookBody } from '@/app/types/line';
import { validateWebhookRequest } from '@/lib/services/line/webhook/validate';
import { handleIncomingMessage } from '@/lib/services/message/handlers';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-line-signature');

    // Validate webhook request
    const validation = await validateWebhookRequest(rawBody, signature);
    if (!validation.isValid || !validation.account) {
      return NextResponse.json(
        { error: validation.error || 'Invalid request' },
        { status: 401 }
      );
    }

    // Parse webhook body
    const webhookBody: LineWebhookBody = JSON.parse(rawBody);

    // Process each message event
    for (const event of webhookBody.events) {
      if (event.type === 'message' && 
          event.message.type === 'text' && 
          event.message.text) { // Add null check for text
        await handleIncomingMessage({
          userId: event.source.userId,
          content: event.message.text, // Now guaranteed to be string
          platform: 'LINE',
          messageId: event.message.id,
          timestamp: new Date(event.timestamp),
          lineAccountId: validation.account.id
        });
      }
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
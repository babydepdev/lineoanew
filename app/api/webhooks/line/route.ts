import { NextRequest, NextResponse } from 'next/server';
import { LineWebhookBody } from '@/app/types/line';
import { validateWebhookRequest } from '@/lib/services/line/webhook/validate';
import { handleIncomingMessage } from '@/lib/services/message/handlers';
import { createImageContent } from '@/lib/services/line/image/content';

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
      if (event.type === 'message') {
        let content: string;
        
        // Handle different message types
        switch (event.message.type) {
          case 'text':
            content = event.message.text || '';
            break;
          case 'image':
            content = createImageContent({ messageId: event.message.id });
            break;
          default:
            continue; // Skip unsupported message types
        }

        await handleIncomingMessage({
          userId: event.source.userId,
          content,
          platform: 'LINE',
          messageId: event.message.id,
          timestamp: new Date(event.timestamp),
          lineAccountId: validation.account.id,
          messageType: event.message.type
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
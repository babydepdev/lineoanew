import { NextRequest, NextResponse } from 'next/server';
import { handleLineWebhook } from '@/lib/lineClient';
import { LineMessageEvent, LineWebhookBody } from '@/app/types/line';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LineWebhookBody;
    console.log('Received LINE webhook:', JSON.stringify(body, null, 2));

    if (!body.events || !Array.isArray(body.events)) {
      console.error('Invalid LINE webhook format:', body);
      return NextResponse.json({ error: 'Invalid webhook format' }, { status: 400 });
    }

    const results = await Promise.all(
      body.events.map(async (event: LineMessageEvent) => {
        try {
          return await handleLineWebhook(event);
        } catch (error) {
          console.error('Error processing LINE event:', error);
          return null;
        }
      })
    );

    const successfulEvents = results.filter(Boolean).length;
    console.log(`Processed ${successfulEvents} of ${body.events.length} LINE events`);
    
    return NextResponse.json({ 
      message: 'Processed LINE webhook',
      processed: successfulEvents,
      total: body.events.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing LINE webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// LINE requires a GET endpoint for webhook verification
export async function GET() {
  console.log('Received LINE webhook verification request');
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
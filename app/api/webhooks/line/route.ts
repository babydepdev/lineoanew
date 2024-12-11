import { NextRequest, NextResponse } from 'next/server';
import { handleLineWebhookEvent } from '@/lib/services/lineWebhookService';
import { LineMessageEvent, LineWebhookBody } from '@/app/types/line';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LineWebhookBody;
    console.log('Received LINE webhook:', JSON.stringify(body, null, 2));

    if (!body.events || !Array.isArray(body.events)) {
      console.error('Invalid LINE webhook format:', body);
      return NextResponse.json({ error: 'Invalid webhook format' }, { status: 400 });
    }

    // Get channel ID from request headers
    const channelId = request.headers.get('x-line-channel-id');
    if (!channelId) {
      console.error('Missing channel ID in webhook request');
      return NextResponse.json({ error: 'Missing channel ID' }, { status: 400 });
    }

    // Verify channel exists
    const channel = await prisma.lineChannel.findFirst({
      where: { id: channelId }
    });

    if (!channel) {
      console.error('Invalid channel ID:', channelId);
      return NextResponse.json({ error: 'Invalid channel ID' }, { status: 400 });
    }

    const results = await Promise.allSettled(
      body.events.map(async (event: LineMessageEvent) => {
        try {
          return await handleLineWebhookEvent(event, channelId);
        } catch (error) {
          console.error('Error processing LINE message event:', error);
          return null;
        }
      })
    );

    const successfulEvents = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
    console.log(`Processed ${successfulEvents} of ${body.events.length} LINE events`);
    
    return NextResponse.json({ 
      message: 'Processed LINE webhook',
      processed: successfulEvents,
      total: body.events.length
    });
  } catch (error) {
    console.error('Error processing LINE webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
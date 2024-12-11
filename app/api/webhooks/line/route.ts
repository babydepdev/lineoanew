import { NextRequest, NextResponse } from 'next/server';
import { handleLineWebhookEvent } from '@/lib/services/lineWebhookService';
import { LineWebhookBody } from '@/app/types/line';
import { validateLineWebhook } from '@/lib/services/lineWebhookValidator';
import { getLineChannelByChannelId } from '@/lib/config/lineChannels';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-line-signature');

    if (!signature) {
      console.error('Missing LINE signature in headers');
      return NextResponse.json(
        { error: 'Missing x-line-signature header' },
        { status: 400 }
      );
    }

    const body = await request.json() as LineWebhookBody;
    
    // Get destination from webhook body (this is the LINE Channel ID)
    const { destination } = body;
    if (!destination) {
      console.error('Missing destination in webhook body');
      return NextResponse.json(
        { error: 'Missing destination in webhook body' },
        { status: 400 }
      );
    }

    // Find channel by LINE Channel ID
    const channel = await getLineChannelByChannelId(destination);
    if (!channel) {
      console.error('LINE channel not found for destination:', destination);
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    console.log('Received LINE webhook:', {
      channelId: channel.channelId,
      channelName: channel.name,
      events: body.events?.length || 0
    });

    // Validate webhook with channel credentials
    const validatedData = await validateLineWebhook(body, channel, signature);

    // Process each event
    const results = await Promise.allSettled(
      validatedData.events.map(async (event) => {
        try {
          return await handleLineWebhookEvent(event, validatedData.channel.id);
        } catch (error) {
          console.error('Error processing LINE message event:', error);
          return null;
        }
      })
    );

    const successfulEvents = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
    console.log(`Processed ${successfulEvents} of ${body.events.length} LINE events for channel ${channel.name}`);
    
    return NextResponse.json({ 
      message: 'Processed LINE webhook',
      processed: successfulEvents,
      total: body.events.length,
      channelName: channel.name
    });
  } catch (error) {
    console.error('Error processing LINE webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message.includes('signature') ? 401 : 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
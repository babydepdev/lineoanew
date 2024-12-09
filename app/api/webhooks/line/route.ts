import { NextRequest, NextResponse } from 'next/server';
import { handleLineWebhook } from '@/lib/lineClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received LINE webhook:', body);
    
    const events = body.events;
    
    for (const event of events) {
      await handleLineWebhook(event);
    }
    
    return NextResponse.json({ message: 'Received' }, { status: 200 });
  } catch (error) {
    console.error('Error processing LINE webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
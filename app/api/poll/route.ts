import { NextResponse } from 'next/server';
import { pollForNewMessages } from '@/lib/messageService';

export async function GET() {
  try {
    const conversations = await pollForNewMessages();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error polling messages:', error);
    return NextResponse.json({ error: 'Failed to poll messages' }, { status: 500 });
  }
}
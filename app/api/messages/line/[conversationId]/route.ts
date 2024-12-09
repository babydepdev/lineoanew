import { NextRequest, NextResponse } from 'next/server';
import { queryLineMessages } from '@/lib/services/chatQueryService';

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params;
    const messages = await queryLineMessages(conversationId);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching LINE messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
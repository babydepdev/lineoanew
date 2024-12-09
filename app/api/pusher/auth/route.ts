import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const socketId = data.socket_id;
    const channel = data.channel_name;
    
    // Add your authentication logic here
    const presenceData = {
      user_id: 'user_' + Math.random().toString(36).substr(2, 9),
      user_info: {
        name: 'Anonymous User'
      }
    };

    // Authorize the channel with proper typing
    const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);
    
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
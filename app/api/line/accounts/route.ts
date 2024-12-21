import { NextRequest, NextResponse } from 'next/server';
import { pusherServer, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { createLineAccount } from '@/lib/services/line/account/create';
import { getActiveLineAccounts } from '@/lib/services/line/account/find';
import { LineAccountCreateParams } from '@/lib/services/line/account/types';

export async function GET() {
  try {
    const accounts = await getActiveLineAccounts();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching LINE accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LINE accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, channelAccessToken, channelSecret } = body;

    // Validate required fields
    if (!name || !channelAccessToken || !channelSecret) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create LINE account params
    const params: LineAccountCreateParams = {
      name,
      channelAccessToken,
      channelSecret
    };

    // Create LINE account
    const result = await createLineAccount(params);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create LINE account' },
        { status: 500 }
      );
    }

    // Get updated metrics
    const metrics = await getDashboardMetrics();

    // Broadcast metrics update
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      'metrics-updated',
      metrics
    );

    return NextResponse.json(result.account);
  } catch (error) {
    console.error('Error creating LINE account:', error);
    return NextResponse.json(
      { error: 'Failed to create LINE account' },
      { status: 500 }
    );
  }
}
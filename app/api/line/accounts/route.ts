import { NextRequest, NextResponse } from 'next/server';
import { createLineAccount, getActiveLineAccounts, updateLineAccount } from '@/lib/services/lineAccountService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, channelAccessToken, channelSecret } = body;

    if (!name || !channelAccessToken || !channelSecret) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const account = await createLineAccount({
      name,
      channelAccessToken,
      channelSecret
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Error creating LINE account:', error);
    return NextResponse.json(
      { error: 'Failed to create LINE account' },
      { status: 500 }
    );
  }
}

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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing account ID' },
        { status: 400 }
      );
    }

    const account = await updateLineAccount(id, data);
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error updating LINE account:', error);
    return NextResponse.json(
      { error: 'Failed to update LINE account' },
      { status: 500 }
    );
  }
}
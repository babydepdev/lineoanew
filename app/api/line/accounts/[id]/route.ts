import { NextRequest, NextResponse } from 'next/server';
import { findLineAccountById } from '@/lib/services/line';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const account = await findLineAccountById(id);
    
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error fetching LINE account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    );
  }
}
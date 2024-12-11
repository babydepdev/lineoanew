import { NextRequest, NextResponse } from 'next/server';
import { getLineUserProfile } from '@/lib/services/lineProfileService';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const channelId = request.nextUrl.searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    const profile = await getLineUserProfile(userId, channelId);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
          }
        }
      );
    }
    
    return NextResponse.json(profile, {
      headers: {
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error fetching LINE profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
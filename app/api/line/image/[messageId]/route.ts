import { NextRequest, NextResponse } from 'next/server';
import { getLineClient } from '@/lib/services/lineService';
import { getLineImageBuffer } from '@/lib/services/line/image/process';
import { validateLineImage } from '@/lib/services/line/image/validate';

export async function GET(
  _request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    
    // Validate the image request
    const validation = await validateLineImage(messageId);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get LINE client
    const client = getLineClient();
    
    // Fetch image buffer
    const buffer = await getLineImageBuffer(client, messageId);

    // Return image with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving LINE image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getLineClient } from '@/lib/services/line/client/index';
import { getImageBuffer } from '@/lib/services/line/image';
import { validateLineImage } from '@/lib/services/line/image';

export async function GET(
  _request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    console.log('Handling LINE image request:', messageId);
    
    // Validate the image request
    const validation = await validateLineImage(messageId);
    if (!validation.isValid) {
      console.warn('Invalid image request:', validation.error);
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get LINE client
    const client = getLineClient();
    
    // Fetch image buffer
    const buffer = await getImageBuffer(client, messageId);
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty image buffer received');
    }

    console.log('Successfully fetched image:', {
      messageId,
      size: buffer.length
    });

    // Return image with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Content-Length': buffer.length.toString()
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
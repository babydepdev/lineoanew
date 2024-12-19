import { NextRequest, NextResponse } from 'next/server';
import { getLineClient } from '@/lib/services/lineService';

export async function GET(
  _request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const client = getLineClient();
    
    // Get image content from LINE API
    const imageStream = await client.getMessageContent(messageId);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of imageStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return image with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error fetching LINE image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
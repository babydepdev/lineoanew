import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getLineClient } from '@/lib/services/line/client/instance';
import { getImageBuffer } from '@/lib/services/line/image/process';

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    console.log('Fetching LINE image:', messageId);

    // Get message with LINE account details
    const message = await prisma.message.findFirst({
      where: { 
        externalId: messageId,
        platform: 'LINE'
      },
      include: {
        conversation: {
          include: {
            lineAccount: true
          }
        }
      }
    });

    if (!message?.conversation?.lineAccount) {
      console.error('LINE account not found for message:', messageId);
      return NextResponse.json(
        { error: 'LINE account not found' },
        { status: 404 }
      );
    }

    // Get LINE client for this account
    const client = await getLineClient(message.conversation.lineAccount);
    
    // Fetch image with retries
    const buffer = await getImageBuffer(client, messageId);
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty image buffer received');
    }

    console.log('Successfully fetched image:', {
      messageId,
      size: buffer.length
    });

    // Return image with caching headers
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
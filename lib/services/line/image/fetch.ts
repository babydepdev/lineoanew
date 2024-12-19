import { Client } from '@line/bot-sdk';
import { LineImageStream } from './types';

export async function fetchLineImage(
  client: Client,
  messageId: string
): Promise<LineImageStream> {
  try {
    console.log('Fetching LINE image:', { messageId });

    // Get message content as a stream
    const stream = await client.getMessageContent(messageId);
    
    if (!stream || !stream.readable) {
      throw new Error('Invalid image stream received from LINE API');
    }

    // Add headers to the stream
    const imageStream = stream as LineImageStream;
    imageStream.headers = {
      'content-type': 'image/jpeg', // LINE API always returns JPEG
      'content-length': stream.readable ? '0' : undefined
    };

    console.log('Successfully fetched LINE image');
    return imageStream;
  } catch (error) {
    // Log detailed error information
    console.error('Error fetching LINE image:', {
      messageId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });

    if (error instanceof Error && error.message.includes('400')) {
      throw new Error('Invalid message ID or image no longer available');
    }

    throw new Error('Failed to fetch image from LINE API');
  }
}
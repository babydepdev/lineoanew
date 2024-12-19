import { Client } from '@line/bot-sdk';
import { LineImageStream } from './types';

export async function fetchLineImage(
  client: Client,
  messageId: string
): Promise<LineImageStream> {
  try {
    // Get message content as a stream
    const stream = await client.getMessageContent(messageId);
    
    // Add headers to the stream
    const imageStream = stream as LineImageStream;
    imageStream.headers = {
      'content-type': 'image/jpeg', // LINE API always returns JPEG
      'content-length': stream.readable ? '0' : undefined
    };

    return imageStream;
  } catch (error) {
    console.error('Error fetching LINE image:', error);
    throw new Error('Failed to fetch image from LINE API');
  }
}
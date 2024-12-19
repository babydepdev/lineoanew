import { Client } from '@line/bot-sdk';
import { LineImageResponse, LineImageStream } from './types';

/**
 * Fetch raw image content from LINE's API
 */
export async function fetchImageContent(
  client: Client,
  messageId: string
): Promise<LineImageStream> {
  try {
    const response = await client.getMessageContent(messageId) as unknown as LineImageResponse;
    
    if (!response || !response.headers) {
      throw new Error('Invalid response from LINE API');
    }

    // Create a stream with headers
    const stream = response as unknown as LineImageStream;
    stream.headers = response.headers;

    return stream;
  } catch (error) {
    console.error('Error fetching LINE image:', error);
    throw new Error('Failed to fetch image from LINE API');
  }
}

/**
 * Convert stream to buffer
 */
export async function streamToBuffer(stream: LineImageStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  try {
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('Error converting stream to buffer:', error);
    throw new Error('Failed to convert stream to buffer');
  }
}
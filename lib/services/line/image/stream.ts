import { Client } from '@line/bot-sdk';
import { LineImageStream } from './types';

/**
 * Get a readable stream for the LINE image
 */
export async function getLineImageStream(
  client: Client,
  messageId: string
): Promise<LineImageStream> {
  try {
    const response = await client.getMessageContent(messageId);
    if (!response || !response.headers) {
      throw new Error('Invalid response from LINE API');
    }
    return response as LineImageStream;
  } catch (error) {
    console.error('Error getting image stream:', error);
    throw new Error('Failed to get image stream');
  }
}

/**
 * Convert a readable stream to a buffer
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
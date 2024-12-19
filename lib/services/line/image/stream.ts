import { Readable } from 'stream';
import { Client } from '@line/bot-sdk';

/**
 * Get a readable stream for the LINE image
 */
export async function getLineImageStream(
  client: Client,
  messageId: string
): Promise<Readable> {
  try {
    const response = await client.getMessageContent(messageId);
    return response;
  } catch (error) {
    console.error('Error getting image stream:', error);
    throw new Error('Failed to get image stream');
  }
}

/**
 * Convert a readable stream to a buffer
 */
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  
  return Buffer.concat(chunks);
}
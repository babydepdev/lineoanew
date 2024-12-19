import { Client } from '@line/bot-sdk';
import { LineImageMetadata } from './types';

export async function fetchLineImage(client: Client, messageId: string): Promise<Buffer> {
  try {
    const stream = await client.getMessageContent(messageId);
    const chunks: Buffer[] = [];
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('Error fetching LINE image:', error);
    throw new Error('Failed to fetch image from LINE API');
  }
}

export function getLineImageUrl(messageId: string): string {
  return `/api/line/image/${messageId}`;
}

export function createImageContent(metadata: LineImageMetadata): string {
  const imageUrl = getLineImageUrl(metadata.messageId);
  return `[Image]${imageUrl}`;
}
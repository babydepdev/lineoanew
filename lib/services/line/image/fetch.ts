import { Client } from '@line/bot-sdk';

/**
 * Fetch image content from LINE's API
 */
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
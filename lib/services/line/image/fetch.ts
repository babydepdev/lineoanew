import { Client } from '@line/bot-sdk';
import { LineImageStream, LineImageResponse } from './types';

export async function fetchLineImage(
  client: Client,
  messageId: string
): Promise<LineImageStream> {
  try {
    // Get message content as unknown first
    const response = await client.getMessageContent(messageId) as unknown;
    
    // Validate response
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response from LINE API');
    }

    // Cast to our expected type
    const imageResponse = response as LineImageResponse;
    
    // Create stream with headers
    const stream = imageResponse as unknown as LineImageStream;
    stream.headers = imageResponse.headers || {};

    return stream;
  } catch (error) {
    console.error('Error fetching LINE image:', error);
    throw new Error('Failed to fetch image from LINE API');
  }
}
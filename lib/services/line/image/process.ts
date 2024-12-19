import { Client } from '@line/bot-sdk';
import { ImageProcessingResult } from './types';
import { fetchLineImage } from './fetch';
import { streamToBuffer } from './stream';
import { validateLineImage } from './validate';

export async function processLineImage(
  client: Client,
  messageId: string
): Promise<ImageProcessingResult> {
  try {
    // Validate request
    const validation = await validateLineImage(messageId);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Fetch image stream
    const stream = await fetchLineImage(client, messageId);
    
    // Convert to buffer
    const buffer = await streamToBuffer(stream);
    
    return {
      success: true,
      buffer,
      contentType: stream.headers['content-type']
    };
  } catch (error) {
    console.error('Error processing LINE image:', error);
    return {
      success: false,
      error: 'Failed to process image'
    };
  }
}

export async function getImageBuffer(
  client: Client,
  messageId: string
): Promise<Buffer> {
  const stream = await fetchLineImage(client, messageId);
  return streamToBuffer(stream);
}
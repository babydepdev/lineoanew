import { Client } from '@line/bot-sdk';
import { Readable } from 'stream';
import { LineImageStream } from './types';
import { streamToBuffer } from './stream';
import { validateLineImage } from './validate';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function getImageBuffer(
  client: Client,
  messageId: string
): Promise<Buffer> {
  try {
    // Validate request
    const validation = await validateLineImage(messageId);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid image request');
    }

    // Add retry logic
    let retries = MAX_RETRIES;
    let lastError: Error | null = null;

    while (retries > 0) {
      try {
        // Fetch image stream
        const rawStream = await client.getMessageContent(messageId);
        if (!rawStream || !rawStream.readable) {
          throw new Error('Invalid image stream');
        }

        // Convert to LineImageStream
        const stream: LineImageStream = Object.assign(rawStream as Readable, {
          headers: {
            'content-type': 'image/jpeg',
            'content-length': undefined
          }
        });
        
        // Convert to buffer
        const buffer = await streamToBuffer(stream);
        if (!buffer || buffer.length === 0) {
          throw new Error('Empty image buffer');
        }

        return buffer;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    throw lastError || new Error('Failed to fetch image after retries');
  } catch (error) {
    console.error('Error getting image buffer:', error);
    throw error;
  }
}
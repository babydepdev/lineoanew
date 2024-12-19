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
    if (!stream || !stream.readable) {
      return {
        success: false,
        error: 'Invalid image stream'
      };
    }
    
    // Convert to buffer
    const buffer = await streamToBuffer(stream);
    if (!buffer || buffer.length === 0) {
      return {
        success: false,
        error: 'Empty image buffer'
      };
    }
    
    return {
      success: true,
      buffer,
      contentType: 'image/jpeg' // LINE API always returns JPEG
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
  try {
    const stream = await fetchLineImage(client, messageId);
    if (!stream || !stream.readable) {
      throw new Error('Invalid image stream');
    }
    
    const buffer = await streamToBuffer(stream);
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty image buffer');
    }
    
    return buffer;
  } catch (error) {
    console.error('Error getting image buffer:', error);
    throw error;
  }
}
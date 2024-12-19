import { Client } from '@line/bot-sdk';
import { ImageProcessingResult } from './types';
import { fetchLineImage } from './fetch';
import { streamToBuffer } from './stream';
import { validateLineImage } from './validate';

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

    // Fetch image stream
    const stream = await fetchLineImage(client, messageId);
    if (!stream || !stream.readable) {
      throw new Error('Invalid image stream');
    }
    
    // Convert to buffer
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

export async function processLineImage(
  client: Client,
  messageId: string
): Promise<ImageProcessingResult> {
  try {
    const buffer = await getImageBuffer(client, messageId);
    const base64Data = buffer.toString('base64');
    
    return {
      success: true,
      base64: base64Data,
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

export async function getImageBase64(
  client: Client,
  messageId: string
): Promise<string> {
  const buffer = await getImageBuffer(client, messageId);
  return buffer.toString('base64');
}
import { Client } from '@line/bot-sdk';
import { ImageProcessingResult, LineImageMetadata } from './types';
import { fetchImageContent } from './fetch';
import { streamToBuffer } from './stream';
import { validateLineImage } from './validate';
import { generateLineImageUrl } from './url';

/**
 * Get image metadata from stream
 */
export async function getImageMetadata(
  client: Client,
  messageId: string
): Promise<LineImageMetadata> {
  const stream = await fetchImageContent(client, messageId);
  
  return {
    messageId,
    contentType: stream.headers['content-type'],
    contentLength: parseInt(stream.headers['content-length'] || '0', 10)
  };
}

/**
 * Process LINE image and return URL
 */
export async function processLineImage(
  client: Client,
  messageId: string
): Promise<ImageProcessingResult> {
  try {
    // Validate first
    const validation = await validateLineImage(messageId);
    if (!validation.isValid) {
      return {
        success: false,
        url: '',
        error: validation.error
      };
    }

    // Generate URL
    const imageUrl = generateLineImageUrl(messageId);

    return {
      success: true,
      url: imageUrl
    };
  } catch (error) {
    console.error('Error processing LINE image:', error);
    return {
      success: false,
      url: '',
      error: 'Failed to process image'
    };
  }
}

/**
 * Get image buffer
 */
export async function getImageBuffer(
  client: Client,
  messageId: string
): Promise<Buffer> {
  const stream = await fetchImageContent(client, messageId);
  return streamToBuffer(stream);
}
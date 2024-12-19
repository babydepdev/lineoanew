import { Client } from '@line/bot-sdk';
import { ImageProcessingResult } from './types';
import { fetchLineImage } from './fetch';
import { validateLineImage } from './validate';
import { generateLineImageUrl } from './url';

/**
 * Process a LINE image and return its URL for display
 */
export async function processLineImage(
  client: Client,
  messageId: string
): Promise<ImageProcessingResult> {
  try {
    // Validate the image first
    const validation = await validateLineImage(messageId);
    if (!validation.isValid) {
      return {
        success: false,
        url: '',
        error: validation.error
      };
    }

    // Generate the URL for the image
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
 * Fetch the actual image buffer from LINE's API
 */
export async function getLineImageBuffer(client: Client, messageId: string): Promise<Buffer> {
  return fetchLineImage(client, messageId);
}
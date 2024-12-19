import { Client } from '@line/bot-sdk';
import { ImageProcessingResult, LineImageMetadata } from './types';
import { fetchLineImage } from './fetch';
import { validateLineImage } from './validate';

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

    // Create metadata
    const metadata: LineImageMetadata = {
      messageId,
      contentType: 'image/jpeg' // LINE images are typically JPEG
    };

    // Generate the URL for the image
    const imageUrl = `/api/line/image/${messageId}`;

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

export async function getLineImageBuffer(client: Client, messageId: string): Promise<Buffer> {
  return fetchLineImage(client, messageId);
}
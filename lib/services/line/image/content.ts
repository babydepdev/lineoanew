import { LineImageMetadata, ImageContent } from './types';
import { generateLineImageUrl } from './url';

const IMAGE_PREFIX = '[Image]';

/**
 * Create image content with proper formatting and URL
 */
export function createImageContent(metadata: LineImageMetadata): string {
  if (!metadata.messageId) {
    throw new Error('Message ID is required to create image content');
  }
  const url = generateLineImageUrl(metadata.messageId);
  return `${IMAGE_PREFIX}${url}`;
}

/**
 * Check if a message content represents an image
 */
export function isImageContent(content: string): boolean {
  return content.startsWith(IMAGE_PREFIX);
}

/**
 * Extract image URL from content string
 */
export function extractImageUrl(content: string): string | null {
  if (!isImageContent(content)) {
    return null;
  }
  return content.substring(IMAGE_PREFIX.length).trim();
}

/**
 * Parse image content string into strucktured object
 */
export function parseImageContent(content: string): ImageContent | null {
  if (!isImageContent(content)) {
    return null;
  }

  const url = extractImageUrl(content);
  if (!url) return null;

  const messageId = url.split('/').pop();
  if (!messageId) return null;

  return {
    type: 'image',
    url,
    messageId
  };
}
import { LineImageMetadata } from './types';
import { formatImageContent } from './url';

/**
 * Create image content with proper formatting and URL
 */
export function createImageContent(metadata: LineImageMetadata): string {
  if (!metadata.messageId) {
    throw new Error('Message ID is required to create image content');
  }
  return formatImageContent(metadata.messageId);
}

/**
 * Check if a message content represents an image
 */
export function isImageContent(content: string): boolean {
  return content.startsWith('[Image]');
}

/**
 * Extract image URL from content string
 */
export function extractImageUrl(content: string): string | null {
  if (!isImageContent(content)) {
    return null;
  }
  return content.replace('[Image]', '').trim();
}
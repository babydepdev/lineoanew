/**
 * Generate a URL for accessing a LINE image through our API
 */
export function generateLineImageUrl(messageId: string): string {
  if (!messageId) {
    throw new Error('Message ID is required to generate image URL');
  }
  return `/api/line/image/${messageId}`;
}

/**
 * Extract message ID from image URL
 */
export function extractMessageIdFromUrl(url: string): string | null {
  try {
    const parts = url.split('/');
    const messageId = parts[parts.length - 1];
    return messageId || null;
  } catch {
    return null;
  }
}

/**
 * Validate image URL format
 */
export function isValidImageUrl(url: string): boolean {
  return url.startsWith('/api/line/image/') && !!extractMessageIdFromUrl(url);
}
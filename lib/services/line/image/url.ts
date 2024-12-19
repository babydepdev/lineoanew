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
   * Format the full image content string including the URL
   */
  export function formatImageContent(messageId: string): string {
    const imageUrl = generateLineImageUrl(messageId);
    return `[Image]${imageUrl}`;
  }
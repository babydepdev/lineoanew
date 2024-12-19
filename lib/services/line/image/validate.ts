import { ImageValidationResult } from './types';

export async function validateLineImage(messageId: string): Promise<ImageValidationResult> {
  try {
    if (!messageId) {
      return {
        isValid: false,
        error: 'Missing message ID'
      };
    }

    // Validate message ID format (LINE message IDs are numeric)
    if (!/^\d+$/.test(messageId)) {
      return {
        isValid: false,
        error: 'Invalid message ID format'
      };
    }

    return {
      isValid: true,
      metadata: {
        messageId
      }
    };
  } catch (error) {
    console.error('Error validating LINE image:', error);
    return {
      isValid: false,
      error: 'Image validation failed'
    };
  }
}
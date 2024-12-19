import { ImageValidationResult } from './types';

export async function validateLineImage(messageId: string): Promise<ImageValidationResult> {
  try {
    if (!messageId) {
      return {
        isValid: false,
        error: 'Missing message ID'
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
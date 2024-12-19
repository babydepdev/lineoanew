import { ContentValidationResult } from '../types/validation';

export function validateMessageContent(content: string): ContentValidationResult {
  try {
    if (!content) {
      return {
        isValid: false,
        error: 'Message content is required'
      };
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return {
        isValid: false,
        error: 'Message content cannot be empty'
      };
    }

    return {
      isValid: true,
      content: trimmedContent
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Content validation failed'
    };
  }
}
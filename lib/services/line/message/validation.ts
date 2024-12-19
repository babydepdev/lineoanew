import { LineMessageParams } from './types';
import { MessageValidationResult } from '../../message/types';

/**
 * Validates LINE message parameters before creation
 */
export function validateMessageParams(params: LineMessageParams): MessageValidationResult {
  try {
    const { messageType, text, contentProvider } = params;

    // Validate based on message type
    switch (messageType) {
      case 'text':
        return validateTextParams(text);
      case 'image':
        return validateImageParams(contentProvider);
      default:
        return {
          isValid: false,
          error: `Unsupported message type: ${messageType}`
        };
    }
  } catch (error) {
    console.error('Error validating message params:', error);
    return {
      isValid: false,
      error: 'Message validation failed'
    };
  }
}

/**
 * Validates text message parameters
 */
function validateTextParams(text?: string): MessageValidationResult {
  if (!text?.trim()) {
    return {
      isValid: false,
      error: 'Empty or missing text content'
    };
  }

  return {
    isValid: true,
    contentType: 'text',
    content: text.trim()
  };
}

/**
 * Validates image message parameters
 */
function validateImageParams(contentProvider?: {
  type: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
}): MessageValidationResult {
  if (!contentProvider?.originalContentUrl) {
    return {
      isValid: false,
      error: 'Missing image URL'
    };
  }

  return {
    isValid: true,
    contentType: 'image',
    content: 'Sent an image',
    contentUrl: contentProvider.originalContentUrl
  };
}
import { LineMessageEvent } from '@/app/types/line';
import { LineMessageValidationResult } from './types';

/**
 * Validates a LINE message event and determines its type and content
 */
export function validateLineMessage(event: LineMessageEvent): LineMessageValidationResult {
  try {
    // Check event type
    if (event.type !== 'message') {
      return {
        isValid: false,
        error: 'Not a message event'
      };
    }

    // Check message exists
    if (!event.message) {
      return {
        isValid: false,
        error: 'Missing message content'
      };
    }

    // Validate based on message type
    switch (event.message.type) {
      case 'text':
        return validateTextMessage(event.message.text);
      case 'image':
        return validateImageMessage(event.message.contentProvider);
      default:
        return {
          isValid: false,
          error: `Unsupported message type: ${event.message.type}`
        };
    }
  } catch (error) {
    console.error('Error validating LINE message:', error);
    return {
      isValid: false,
      error: 'Message validation failed'
    };
  }
}

/**
 * Validates a text message
 */
function validateTextMessage(text?: string): LineMessageValidationResult {
  if (!text?.trim()) {
    return {
      isValid: false,
      error: 'Empty or missing text content'
    };
  }

  return {
    isValid: true,
    messageType: 'text',
    text: text.trim()
  };
}

/**
 * Validates an image message
 */
function validateImageMessage(contentProvider?: {
  type: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
}): LineMessageValidationResult {
  if (!contentProvider?.originalContentUrl) {
    return {
      isValid: false,
      error: 'Missing image URL'
    };
  }

  return {
    isValid: true,
    messageType: 'image',
    contentProvider
  };
}
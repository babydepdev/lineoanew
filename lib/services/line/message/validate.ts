import { LineMessageEvent } from '@/app/types/line';
import { LineMessageValidationResult } from './types';
import { isValidMessage } from './types/messages';

export function validateLineMessage(event: LineMessageEvent): LineMessageValidationResult {
  try {
    // Check event type
    if (event.type !== 'message') {
      return {
        isValid: false,
        error: 'Not a message event'
      };
    }

    // Check message type and validity
    if (!event.message || !isValidMessage(event.message)) {
      return {
        isValid: false,
        error: 'Invalid message format'
      };
    }

    // Handle different message types
    switch (event.message.type) {
      case 'text':
        const text = event.message.text?.trim();
        if (!text) {
          return {
            isValid: false,
            error: 'Empty or missing text content'
          };
        }
        return { isValid: true, text, messageType: 'text' };

      case 'image':
        // For image messages, we'll use a placeholder text with the image URL
        // The actual image URL will be handled by the LINE API
        const imageUrl = `https://api-data.line.me/v2/bot/message/${event.message.id}/content`;
        return { 
          isValid: true, 
          text: `[Image]${imageUrl}`,
          messageType: 'image'
        };

      default:
        return {
          isValid: false,
          error: 'Unsupported message type'
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
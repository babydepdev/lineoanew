import { LineMessageEvent } from '@/app/types/line';
import { LineMessageValidationResult } from './types';
import { isValidMessage } from './types/messages';
import { parseImageMessage } from './types/imageMessage';

export function validateLineMessage(event: LineMessageEvent): LineMessageValidationResult {
  try {
    if (event.type !== 'message') {
      return {
        isValid: false,
        error: 'Not a message event'
      };
    }

    if (!event.message || !isValidMessage(event.message)) {
      return {
        isValid: false,
        error: 'Invalid message format'
      };
    }

    switch (event.message.type) {
      case 'text':
        const text = event.message.text?.trim();
        if (!text) {
          return {
            isValid: false,
            error: 'Empty or missing text content'
          };
        }
        return { 
          isValid: true, 
          text, 
          messageType: 'text' 
        };

      case 'image':
        const imageContent = parseImageMessage(event.message);
        return { 
          isValid: true, 
          text: JSON.stringify(imageContent),
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
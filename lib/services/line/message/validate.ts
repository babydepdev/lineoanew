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

    // For text messages
    if (event.message.type === 'text') {
      const text = event.message.text?.trim();
      if (!text) {
        return {
          isValid: false,
          error: 'Empty or missing text content'
        };
      }
      return { 
        isValid: true, 
        messageType: 'text',
        text 
      };
    }

    // For image messages
    if (event.message.type === 'image') {
      return {
        isValid: true,
        messageType: 'image',
        contentProvider: event.message.contentProvider
      };
    }

    return {
      isValid: false,
      error: 'Unsupported message type'
    };
  } catch (error) {
    console.error('Error validating LINE message:', error);
    return {
      isValid: false,
      error: 'Message validation failed'
    };
  }
}
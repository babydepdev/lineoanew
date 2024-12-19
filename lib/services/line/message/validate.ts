import { MessageEvent } from '@line/bot-sdk';
import { MessageValidationResult } from './types/base';
import { validateSource } from './types/source';
import { validateTextMessage } from './types/text';
import { validateImageMessage, parseImageMessage } from './types/image';

export function validateLineMessage(event: MessageEvent): MessageValidationResult {
  try {
    // Validate source first
    if (!validateSource(event.source)) {
      return {
        isValid: false,
        error: 'Invalid source or missing userId'
      };
    }

    // Validate message based on type
    const message = event.message;

    switch (message.type) {
      case 'text':
        if (!validateTextMessage(message)) {
          return {
            isValid: false,
            error: 'Invalid text message format'
          };
        }
        const text = message.text.trim();
        if (!text) {
          return {
            isValid: false,
            error: 'Empty text content'
          };
        }
        return { 
          isValid: true, 
          text,
          messageType: 'text'
        };

      case 'image':
        if (!validateImageMessage(message)) {
          return {
            isValid: false,
            error: 'Invalid image message format'
          };
        }
        try {
          const imageContent = parseImageMessage(message);
          return { 
            isValid: true, 
            text: JSON.stringify(imageContent),
            messageType: 'image'
          };
        } catch (error) {
          return {
            isValid: false,
            error: 'Failed to parse image message'
          };
        }

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
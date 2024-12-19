import { MessageEvent } from '@line/bot-sdk';
import { LineMessageValidationResult } from './types';
import { isValidMessage } from './types/messages';
import { parseImageMessage } from './types/imageMessage';

export function validateLineMessage(event: MessageEvent): LineMessageValidationResult {
  try {
    if (!isValidMessage(event)) {
      return {
        isValid: false,
        error: 'Invalid message format'
      };
    }

    const message = event.message;

    switch (message.type) {
      case 'text':
        const text = message.text?.trim();
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
        try {
          const imageContent = parseImageMessage(event);
          return { 
            isValid: true, 
            text: JSON.stringify(imageContent),
            messageType: 'image'
          };
        } catch (error) {
          return {
            isValid: false,
            error: 'Invalid image message format'
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
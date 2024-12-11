import { LineMessageEvent } from '@/app/types/line';
import { LineMessageValidationResult } from './types';

export function validateLineMessage(event: LineMessageEvent): LineMessageValidationResult {
  try {
    // Check event type
    if (event.type !== 'message') {
      return {
        isValid: false,
        error: 'Not a message event'
      };
    }

    // Check message type
    if (!event.message || event.message.type !== 'text') {
      return {
        isValid: false,
        error: 'Not a text message'
      };
    }

    // Check text content
    const text = event.message.text?.trim();
    if (!text) {
      return {
        isValid: false,
        error: 'Empty or missing text content'
      };
    }

    // Check source information
    if (!event.source || !event.source.userId) {
      return {
        isValid: false,
        error: 'Missing source information'
      };
    }

    return {
      isValid: true,
      text
    };
  } catch (error) {
    console.error('Error validating LINE message:', error);
    return {
      isValid: false,
      error: 'Message validation failed'
    };
  }
}
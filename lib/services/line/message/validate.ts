import { LineMessageEvent } from '@/app/types/line';
import { LineMessageValidationResult } from './types';

export function validateLineMessage(event: LineMessageEvent): LineMessageValidationResult {
  // Check event type
  if (event.type !== 'message') {
    return {
      isValid: false,
      error: 'Not a message event'
    };
  }

  // Check message type
  if (event.message.type !== 'text') {
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

  return {
    isValid: true,
    text
  };
}
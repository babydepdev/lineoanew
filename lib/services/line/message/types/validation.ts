import { LineMessageEvent } from '@/app/types/line';

export interface MessageValidationResult {
  isValid: boolean;
  error?: string;
  text?: string;
}

export function validateMessageEvent(event: LineMessageEvent): MessageValidationResult {
  if (event.type !== 'message') {
    return {
      isValid: false,
      error: 'Not a message event'
    };
  }

  if (!event.message || event.message.type !== 'text') {
    return {
      isValid: false,
      error: 'Not a text message'
    };
  }

  const text = event.message.text?.trim();
  if (!text) {
    return {
      isValid: false,
      error: 'Empty message text'
    };
  }

  return {
    isValid: true,
    text
  };
}
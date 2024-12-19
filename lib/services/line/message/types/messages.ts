import { Message as LineMessage } from '@line/bot-sdk';

export interface TextMessage {
  type: 'text';
  text: string;
  emojis?: Array<{
    index: number;
    productId: string;
    emojiId: string;
  }>;
}

export interface ImageMessage {
  type: 'image';
  contentProvider: {
    type: string;
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
}

export type LineMessageType = TextMessage | ImageMessage;

export function createTextMessage(text: string): TextMessage {
  return {
    type: 'text',
    text: text.trim()
  };
}

export function isValidMessage(message: unknown): message is LineMessage {
  if (!message || typeof message !== 'object') return false;
  
  const msg = message as Record<string, unknown>;
  if (!msg.type || typeof msg.type !== 'string') return false;
  
  switch (msg.type) {
    case 'text':
      return typeof msg.text === 'string';
    case 'image':
      return true; // Basic validation for image type
    default:
      return false;
  }
}
import { MessageEvent } from '@line/bot-sdk';
import { LineImageMessage, isImageMessage } from './imageMessage';

export interface TextMessage {
  type: 'text';
  text: string;
  emojis?: Array<{
    index: number;
    productId: string;
    emojiId: string;
  }>;
}

export type LineMessageType = TextMessage | LineImageMessage;

export function createTextMessage(text: string): TextMessage {
  return {
    type: 'text',
    text: text.trim()
  };
}

export function isValidMessage(message: MessageEvent): boolean {
  if (!message || typeof message !== 'object') return false;
  
  if (message.type !== 'message') return false;
  
  const msg = message.message;
  
  switch (msg.type) {
    case 'text':
      return typeof msg.text === 'string';
    case 'image':
      return isImageMessage(msg);
    default:
      return false;
  }
}
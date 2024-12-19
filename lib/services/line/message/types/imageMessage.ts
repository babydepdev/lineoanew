import { MessageEvent } from '@line/bot-sdk';

// Define the LINE API image message structure
export interface LineImageMessage {
  type: 'image';
  id: string;
  contentProvider: {
    type: 'line' | 'external';
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
}

export interface LineImageContent {
  type: 'image';
  originalUrl?: string;
  previewUrl?: string;
}

export function parseImageMessage(message: MessageEvent): LineImageContent {
  // Type guard to ensure message is an image message
  if (message.type !== 'message' || message.message.type !== 'image') {
    throw new Error('Invalid message type');
  }

  const imageMessage = message.message as LineImageMessage;

  return {
    type: 'image',
    originalUrl: imageMessage.contentProvider?.originalContentUrl,
    previewUrl: imageMessage.contentProvider?.previewImageUrl
  };
}

// Type guard for image messages
export function isImageMessage(message: any): message is LineImageMessage {
  return (
    message &&
    message.type === 'image' &&
    message.contentProvider &&
    typeof message.contentProvider === 'object'
  );
}
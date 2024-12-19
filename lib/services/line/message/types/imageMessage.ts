import { ImageMessage } from '@line/bot-sdk';

export interface LineImageContent {
  type: 'image';
  originalUrl?: string;
  previewUrl?: string;
}

export function parseImageMessage(message: ImageMessage): LineImageContent {
  return {
    type: 'image',
    originalUrl: message.contentProvider?.originalContentUrl,
    previewUrl: message.contentProvider?.previewImageUrl
  };
}
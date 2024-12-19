import { Platform } from '@prisma/client';
import { LineSource } from './source';

export interface BaseMessageParams {
  userId: string;
  messageId: string;
  timestamp: Date;
  channelId: string;
  platform: Platform;
  lineAccountId?: string | null;
  source: LineSource;
  messageType?: 'text' | 'image';
}

export interface TextMessageParams extends BaseMessageParams {
  messageType: 'text';
  text: string;
}

export interface ImageMessageParams extends BaseMessageParams {
  messageType: 'image';
  imageContent: {
    originalUrl?: string;
    previewUrl?: string;
  };
}

export type MessageParams = TextMessageParams | ImageMessageParams;

export interface MessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MessageValidationResult {
  isValid: boolean;
  error?: string;
  text?: string;
  messageType?: 'text' | 'image';
}
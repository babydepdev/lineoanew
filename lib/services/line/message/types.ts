import { Platform } from '@prisma/client';
import { LineSource } from '@/app/types/line';

export interface LineMessageParams {
  userId: string;
  text: string;
  messageId: string;
  timestamp: Date;
  channelId: string;
  platform: Platform;
  lineAccountId?: string | null;
  source: LineSource;
  messageType?: 'text' | 'image';
}

export interface LineMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface LineMessageValidationResult {
  isValid: boolean;
  error?: string;
  text?: string;
  messageType?: 'text' | 'image';
}

export interface SendMessageResult {
  success: boolean;
  error?: string;
}
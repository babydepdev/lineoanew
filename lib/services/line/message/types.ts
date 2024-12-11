import { Platform } from '@prisma/client';

export interface LineMessageParams {
  userId: string;
  text: string; // Required and non-optional
  messageId: string;
  timestamp: Date;
  channelId: string;
  platform: Platform;
  lineAccountId?: string | null;
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
}
export * from './messageTypes';
export * from './messages';
export * from './validation';

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
}

export interface LineMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ReplyMessageConfig {
  maxAge: number;
  retryOnFailure: boolean;
  fallbackToPush: boolean;
}
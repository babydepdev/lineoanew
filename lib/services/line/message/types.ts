import { Platform } from '@prisma/client';
import { LineSource } from '@/app/types/line';

// Core message types
export interface MessageBase {
  type: string;
  messageId: string;
}

// Message creation params
export interface MessageCreateParams {
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

// Message results
export interface MessageCreateResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MessageSendResult {
  success: boolean;
  error?: string;
}

// Message validation
export interface MessageValidationResult {
  isValid: boolean;
  error?: string;
  text?: string;
  messageType?: 'text' | 'image';
}
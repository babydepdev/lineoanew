import { Platform, SenderType } from '@prisma/client';

/**
 * Supported message content types
 */
export type MessageContentType = 'text' | 'image';

/**
 * Base interface for all message parameters
 */
export interface BaseMessageParams {
  conversationId: string;
  sender: SenderType;
  platform: Platform;
  timestamp?: Date;
  externalId?: string | null;
  chatType?: string | null;
  chatId?: string | null;
}

/**
 * Common result interface for message operations
 */
export interface MessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
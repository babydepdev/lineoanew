import { Platform } from '@prisma/client';
import { MessageContentType } from './base';

/**
 * Source information for LINE messages
 */
export interface LineMessageSource {
  type: string;
  userId: string;
  roomId?: string;
  groupId?: string;
}

/**
 * Content provider for LINE messages
 */
export interface LineContentProvider {
  type: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
}

/**
 * Parameters for LINE-specific messages
 */
export interface LineMessageParams {
  userId: string;
  text: string;
  messageId: string;
  timestamp: Date;
  channelId: string;
  platform: Platform;
  lineAccountId: string;
  source: LineMessageSource;
  messageType?: MessageContentType;
  contentProvider?: LineContentProvider;
}

/**
 * Result of LINE message operations
 */
export interface LineMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
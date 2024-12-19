import { Platform, SenderType } from '@prisma/client';

/**
 * Supported message content types
 */
export type MessageContentType = 'text' | 'image';

/**
 * Base parameters for creating a message
 */
interface BaseMessageParams {
  conversationId: string;
  sender: SenderType;
  platform: Platform;
  timestamp?: Date;
  externalId?: string | null;
  chatType?: string | null;
  chatId?: string | null;
}

/**
 * Parameters for creating a text message
 */
export interface TextMessageParams extends BaseMessageParams {
  contentType: 'text';
  content: string;
  contentUrl?: never;
}

/**
 * Parameters for creating an image message
 */
export interface ImageMessageParams extends BaseMessageParams {
  contentType: 'image';
  content: string; // Fallback text description
  contentUrl: string;
}

/**
 * Union type for all message creation parameters
 */
export type MessageCreateParams = TextMessageParams | ImageMessageParams;

/**
 * Result of a message creation operation
 */
export interface MessageCreateResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Result of a message broadcast operation
 */
export interface MessageBroadcastResult {
  success: boolean;
  error?: string;
}

/**
 * Parameters for updating a message
 */
export interface MessageUpdateParams {
  content?: string;
  contentType?: MessageContentType;
  contentUrl?: string | null;
}

/**
 * Result of a message update operation
 */
export interface MessageUpdateResult {
  success: boolean;
  error?: string;
}

/**
 * Parameters for querying messages
 */
export interface MessageQueryParams {
  conversationId: string;
  limit?: number;
  before?: Date;
  after?: Date;
  contentType?: MessageContentType;
}

/**
 * Message validation result
 */
export interface MessageValidationResult {
  isValid: boolean;
  error?: string;
  contentType?: MessageContentType;
  content?: string;
  contentUrl?: string;
}

/**
 * Message deletion result
 */
export interface MessageDeleteResult {
  success: boolean;
  error?: string;
}
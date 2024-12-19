import { Platform, SenderType } from '@prisma/client';

export type MessageContentType = 'text' | 'image';

export interface BaseMessageParams {
  conversationId: string;
  content: string;
  contentType: MessageContentType;
  contentUrl?: string | null;
  sender: SenderType;
  platform: Platform;
  externalId?: string | null;
  timestamp?: Date;
  chatType?: string | null;
  chatId?: string | null;
}

export interface MessageCreateResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MessageBroadcastResult {
  success: boolean;
  error?: string;
}

export type MessageCreateParams = BaseMessageParams;
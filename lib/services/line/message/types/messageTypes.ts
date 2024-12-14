import { Platform } from '@prisma/client';

export interface BaseMessageParams {
  conversationId: string;
  content: string;
  sender: 'USER' | 'BOT';
  platform: Platform;
  timestamp?: Date;
}

export interface MessageMetadata {
  externalId?: string | null;
  chatType?: string;
  chatId?: string;
  replyToken?: string;
}

export interface MessageCreateParams extends BaseMessageParams, MessageMetadata {}

export interface MessageResult {
  success: boolean;
  error?: string;
}

export interface ReplyMessageOptions {
  replyToken: string;
  content: string;
  timestamp: number;
  lineAccountId?: string | null;
}

export interface PushMessageOptions {
  userId: string;
  content: string;
  lineAccountId?: string | null;
}
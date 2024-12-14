import { Platform, Prisma } from '@prisma/client';

export interface BaseMessageParams {
  conversationId: string;
  content: string;
  sender: 'USER' | 'BOT';
  platform: Platform;
  timestamp?: Date;
}

export interface MessageCreateParams extends BaseMessageParams {
  externalId?: string | null;
  chatType?: string | null;
  chatId?: string | null;
  metadata?: Prisma.InputJsonValue | null;
}

export interface MessageResult {
  success: boolean;
  error?: string;
}

export interface PushMessageOptions {
  userId: string;
  content: string;
  lineAccountId?: string | null;
}

export interface ReplyMessageOptions {
  replyToken: string;
  content: string;
  timestamp: number;
  lineAccountId?: string | null;
}
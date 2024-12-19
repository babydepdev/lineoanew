import { Platform } from '@prisma/client';
import { LineSource } from '@/app/types/line';

export interface LineMessageParams {
  userId: string;
  text: string;
  messageId: string;
  timestamp: Date;
  channelId: string;
  platform: Platform;
  lineAccountId: string;
  source: LineSource;
  messageType?: 'text' | 'image';
  contentProvider?: {
    type: string;
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
}

export interface LineMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface TextMessageParams extends BaseMessageParams {
  contentType: 'text';
  content: string;
  contentUrl?: never;
}

export interface ImageMessageParams extends BaseMessageParams {
  contentType: 'image';
  content: string;
  contentUrl: string;
}

interface BaseMessageParams {
  conversationId: string;
  sender: 'USER' | 'BOT';
  platform: Platform;
  timestamp?: Date;
  externalId?: string | null;
  chatType?: string | null;
  chatId?: string | null;
}

export type MessageCreateParams = TextMessageParams | ImageMessageParams;
import { Platform, SenderType } from '@prisma/client';

export type MessageContentType = 'text' | 'image';

export interface BaseMessage {
  id: string;
  conversationId: string;
  content: string;
  contentType: MessageContentType;
  contentUrl: string | null;
  sender: SenderType;
  timestamp: Date;
  platform: Platform;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
}

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
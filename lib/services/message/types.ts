import { Platform, SenderType } from '@prisma/client';

export interface MessageCreateParams {
  conversationId: string;
  content: string;
  sender: SenderType;
  platform: Platform;
  externalId?: string | null;
  timestamp?: Date;
  chatType?: string;
  chatId?: string;
  messageType?: 'text' | 'image';
}

export interface MessageBroadcastResult {
  success: boolean;
  error?: string;
}

export interface MessageSendResult {
  success: boolean;
  error?: string;
}
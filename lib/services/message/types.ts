import { Platform, SenderType } from '@prisma/client';

export interface MessageCreateParams {
  conversationId: string;
  content: string;
  sender: SenderType;
  platform: Platform;
  externalId?: string | null;
  timestamp?: Date;
  chatType?: string | null;
  chatId?: string | null;
  messageType?: 'text' | 'image';
  imageBase64: string | null; // Changed from string | undefined to string | null
}

export interface MessageBroadcastResult {
  success: boolean;
  error?: string;
}

export interface MessageSendResult {
  success: boolean;
  error?: string;
}
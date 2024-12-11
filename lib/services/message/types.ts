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
  botId?: string; // Add botId field
}

export interface MessageBroadcastResult {
  success: boolean;
  error?: string;
}

export interface ConversationUpdateResult {
  success: boolean;
  error?: string;
}
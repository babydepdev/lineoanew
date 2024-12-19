import { Platform, SenderType } from '@prisma/client';

export interface MessageCreateParams {
  conversationId: string;
  content: string;
  sender: SenderType;
  platform: Platform;
  externalId?: string | null;
  timestamp?: Date;
  chatType?: string;  // Add optional chatTypes
  chatId?: string;    // Add optional chatId
}

export interface MessageBroadcastResult {
  success: boolean;
  error?: string;
}

export interface ConversationUpdateResult {
  success: boolean;
  error?: string;
}
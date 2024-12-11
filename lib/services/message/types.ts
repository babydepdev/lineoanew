import { Platform, SenderType } from '@prisma/client';

export interface MessageCreateParams {
  conversationId: string;
  content: string; // Make this required
  sender: SenderType;
  platform: Platform;
  externalId?: string | null;
  timestamp?: Date;
}

export interface MessageBroadcastResult {
  success: boolean;
  error?: string;
}

export interface ConversationUpdateResult {
  success: boolean;
  error?: string;
}
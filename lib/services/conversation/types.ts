import { Platform, Conversation } from '@prisma/client';

export interface ConversationCreateParams {
  userId: string;
  platform: Platform;
  channelId: string;
  lineAccountId?: string | null;
}

export interface ConversationFindParams {
  userId: string;
  platform: Platform;
  lineAccountId?: string | null;
}

export interface ConversationResult {
  success: boolean;
  conversation?: Conversation;
  error?: string;
}
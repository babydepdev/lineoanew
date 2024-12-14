import { Platform, SenderType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export interface MessageResponse {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderType;
  timestamp: string;
  platform: Platform;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
  metadata: JsonValue;
}

export interface ConversationResponse {
  id: string;
  platform: Platform;
  channelId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  lineAccountId: string | null;
  messages: MessageResponse[];
}

export interface APIResponse {
  message?: MessageResponse;
  conversation?: ConversationResponse;
  error?: string;
}
import { Platform, SenderType } from '@prisma/client';

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
  imageBase64: string | null; // Add imageBase64 field
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
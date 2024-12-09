import { Message, Platform, SenderType } from '@prisma/client';

export interface MessageResponse {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderType;
  timestamp: string;
  platform: Platform;
  externalId: string | null;
}

export interface ConversationResponse {
  id: string;
  platform: Platform;
  channelId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageResponse[];
}

export interface APIResponse {
  message?: Message;
  conversation?: ConversationResponse;
  error?: string;
}
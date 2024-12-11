import { Platform, SenderType } from '@prisma/client';
import { LineChannel } from './line';

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
  lineChannelId: string | null;
  lineChannel?: LineChannel | null;
  messages: MessageResponse[];
}

export interface APIResponse {
  message?: MessageResponse;
  conversation?: ConversationResponse;
  error?: string;
}
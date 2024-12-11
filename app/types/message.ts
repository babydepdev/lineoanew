import { Platform, SenderType } from '@prisma/client';

// Base message interface
export interface BaseMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderType;
  timestamp: Date | string;
  platform: Platform;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
}

// Serialized message for API responses
export interface SerializedMessage extends BaseMessage {
  timestamp: string;
}

// Runtime message with proper Date object
export interface RuntimeMessage extends BaseMessage {
  timestamp: Date;
}
import { Platform } from '@prisma/client';
import { SerializedMessage, RuntimeMessage } from './message';

// Base conversation interface
export interface BaseConversation {
  id: string;
  platform: Platform;
  channelId: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  lineAccountId: string | null;
}

// Serialized conversation for API responses
export interface SerializedConversation extends BaseConversation {
  messages: SerializedMessage[];
  createdAt: string;
  updatedAt: string;
}

// Runtime conversation with proper Date objects
export interface RuntimeConversation extends BaseConversation {
  messages: RuntimeMessage[];
  createdAt: Date;
  updatedAt: Date;
}
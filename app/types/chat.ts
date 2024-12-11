import { Conversation as PrismaConversation, Message as PrismaMessage, Platform } from '@prisma/client';
import { LineChannel, SerializedLineChannel } from './line';

// Base types from Prisma
export type ConversationWithMessages = PrismaConversation & {
  messages: PrismaMessage[];
  lineChannel?: LineChannel | null;
};

// Serialized types for API/JSON
export interface SerializedMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: 'USER' | 'BOT';
  timestamp: string;
  platform: Platform;
  externalId: string | null;
}

export interface SerializedConversation {
  id: string;
  platform: Platform;
  channelId: string;
  userId: string;
  messages: SerializedMessage[];
  createdAt: string;
  updatedAt: string;
  lineChannelId: string | null;
  lineChannel?: SerializedLineChannel | null;
}

// Type aliases for Pusher events
export type PusherMessage = SerializedMessage;
export type PusherConversation = SerializedConversation;
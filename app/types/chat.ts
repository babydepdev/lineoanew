import { Conversation as PrismaConversation, Message as PrismaMessage, Platform } from '@prisma/client';
import { LineChannel } from './line';

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
  lineChannel?: LineChannel | null;
}

// Helper function to convert serialized to full types
export function deserializeConversation(conv: SerializedConversation): ConversationWithMessages {
  return {
    ...conv,
    messages: conv.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })),
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt),
    lineChannel: conv.lineChannel
  };
}

// Type aliases for Pusher events
export type PusherMessage = SerializedMessage;
export type PusherConversation = SerializedConversation;
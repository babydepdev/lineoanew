import { Conversation as PrismaConversation, Message as PrismaMessage, Platform } from '@prisma/client';

// Base types from Prisma
export type ConversationWithMessages = PrismaConversation & {
  messages: PrismaMessage[];
};

// Serialized types for API/JSON
export interface SerializedMessage extends Omit<PrismaMessage, 'timestamp'> {
  timestamp: string;
}

export interface SerializedConversation extends Omit<PrismaConversation, 'createdAt' | 'updatedAt'> {
  messages: SerializedMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  platform: Platform;
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
    updatedAt: new Date(conv.updatedAt)
  };
}

// Type aliases for Pusher events
export type PusherMessage = SerializedMessage;
export type PusherConversation = SerializedConversation;
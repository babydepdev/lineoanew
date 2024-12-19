import { Conversation as PrismaConversation, Message as PrismaMessage, Platform, SenderType } from '@prisma/client';

// Base message interface with all required fields
export interface MessageWithChat extends PrismaMessage {
  id: string;
  conversationId: string;
  content: string;
  contentType: string;
  contentUrl: string | null;
  sender: SenderType;
  timestamp: Date;
  platform: Platform;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
}

// Conversation with properly typed messages
export type ConversationWithMessages = Omit<PrismaConversation, 'lineAccountId'> & {
  messages: MessageWithChat[];
  lineAccountId?: string | null;
};

// Serialized message for API/JSON
export interface SerializedMessage {
  id: string;
  conversationId: string;
  content: string;
  contentType: string;
  contentUrl: string | null;
  sender: SenderType;
  timestamp: string;
  platform: Platform;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
}

// Serialized conversation for API/JSON
export interface SerializedConversation {
  id: string;
  platform: Platform;
  channelId: string;
  userId: string;
  messages: SerializedMessage[];
  createdAt: string;
  updatedAt: string;
  lineAccountId?: string | null;
}

// Helper function to deserialize conversation
export function deserializeConversation(conv: SerializedConversation): ConversationWithMessages {
  return {
    ...conv,
    messages: conv.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })),
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt),
    lineAccountId: conv.lineAccountId || null
  };
}

// Type aliases for Pusher events
export type PusherMessage = SerializedMessage;
export type PusherConversation = SerializedConversation;
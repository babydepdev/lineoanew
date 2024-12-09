import { Conversation as PrismaConversation, Message as PrismaMessage, Platform } from '@prisma/client';

export type ConversationWithMessages = PrismaConversation & {
  messages: PrismaMessage[];
};

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  platform: Platform;
}

export interface PusherMessage extends Omit<PrismaMessage, 'timestamp'> {
  timestamp: string;
}

export interface PusherConversation extends Omit<ConversationWithMessages, 'messages' | 'createdAt' | 'updatedAt'> {
  messages: PusherMessage[];
  createdAt: string;
  updatedAt: string;
}
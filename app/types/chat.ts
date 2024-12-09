import { Conversation, Message, Platform } from '@prisma/client';

export type SerializedConversation = Omit<Conversation, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  messages: SerializedMessage[];
};

export type SerializedMessage = Omit<Message, 'timestamp'> & {
  timestamp: string;
};

export type ConversationWithMessages = Conversation & {
  messages: Message[];
};

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  platform: Platform;
}

export interface PusherMessage extends Omit<Message, 'timestamp'> {
  timestamp: string;
}

export interface PusherConversation extends Omit<ConversationWithMessages, 'messages' | 'createdAt' | 'updatedAt'> {
  messages: PusherMessage[];
  createdAt: string;
  updatedAt: string;
}
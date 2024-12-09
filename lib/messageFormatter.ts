import { Message, Conversation } from '@prisma/client';
import type { ConversationWithMessages } from '@/app/types/chat';

export interface PusherMessage extends Omit<Message, 'timestamp'> {
  timestamp: string;
}

export interface PusherConversation extends Omit<ConversationWithMessages, 'messages' | 'createdAt' | 'updatedAt'> {
  messages: PusherMessage[];
  createdAt: string;
  updatedAt: string;
}

export function formatMessageForPusher(message: Message): PusherMessage {
  return {
    ...message,
    timestamp: message.timestamp.toISOString(),
  };
}

export function formatConversationForPusher(
  conversation: ConversationWithMessages
): PusherConversation {
  return {
    ...conversation,
    messages: conversation.messages.map(formatMessageForPusher),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  };
}
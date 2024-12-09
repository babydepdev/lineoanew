import { Message, Conversation } from '@prisma/client';
import type { ConversationWithMessages, PusherMessage, PusherConversation } from '@/app/types/chat';

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
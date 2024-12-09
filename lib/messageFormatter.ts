import type { Message } from '@prisma/client';
import type { ConversationWithMessages } from '@/app/types/chat';

export function formatMessageForPusher(message: Message) {
  return {
    ...message,
    timestamp: message.timestamp.toISOString(),
  };
}

export function formatConversationForPusher(conversation: ConversationWithMessages) {
  return {
    ...conversation,
    messages: conversation.messages.map(formatMessageForPusher),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  };
}
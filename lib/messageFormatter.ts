import type { Message } from '@prisma/client';
import type { ConversationWithMessages } from '@/app/types/chat';

// Optimize message size by only including essential fields
export function formatMessageForPusher(message: Message) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp.toISOString(),
    platform: message.platform,
  };
}

// Optimize conversation size by limiting messages and fields
export function formatConversationForPusher(conversation: ConversationWithMessages) {
  // Only include last 50 messages to reduce payload size
  const recentMessages = conversation.messages
    .slice(-50)
    .map(formatMessageForPusher);

  return {
    id: conversation.id,
    platform: conversation.platform,
    userId: conversation.userId,
    messages: recentMessages,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  };
}
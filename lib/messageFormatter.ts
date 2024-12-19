import type { Message } from '@prisma/client';
import type { ConversationWithMessages } from '@/app/types/chat';

export function formatMessageForPusher(message: Message) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp.toISOString(),
    platform: message.platform,
    externalId: message.externalId
  };
}

export function formatConversationForPusher(conversation: ConversationWithMessages) {
  return {
    id: conversation.id,
    platform: conversation.platform,
    userId: conversation.userId,
    channelId: conversation.channelId,
    messages: conversation.messages.map(formatMessageForPusher),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString()
  };
}
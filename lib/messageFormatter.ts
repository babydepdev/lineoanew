import type { Message } from '@prisma/client';
import type { RuntimeConversation } from '@/app/types/conversation';

export function formatMessageForPusher(message: Message) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp.toISOString(),
    platform: message.platform,
    externalId: message.externalId,
    chatType: message.chatType,
    chatId: message.chatId
  };
}

export function formatConversationForPusher(conversation: RuntimeConversation) {
  return {
    id: conversation.id,
    platform: conversation.platform,
    userId: conversation.userId,
    channelId: conversation.channelId,
    messages: conversation.messages.map(formatMessageForPusher),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    lineAccountId: conversation.lineAccountId
  };
}
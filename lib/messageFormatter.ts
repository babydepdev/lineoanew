import type { Message } from '@prisma/client';
import type { ConversationWithMessages, SerializedMessage, SerializedConversation } from '@/app/types/chat';

export function formatMessageForPusher(message: Message): SerializedMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    contentType: message.contentType || 'text',
    contentUrl: message.contentUrl || null,
    sender: message.sender,
    timestamp: message.timestamp.toISOString(),
    platform: message.platform,
    externalId: message.externalId,
    chatType: message.chatType,
    chatId: message.chatId
  };
}

export function formatConversationForPusher(conversation: ConversationWithMessages): SerializedConversation {
  return {
    id: conversation.id,
    platform: conversation.platform,
    channelId: conversation.channelId,
    userId: conversation.userId,
    messages: conversation.messages.map(formatMessageForPusher),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    lineAccountId: conversation.lineAccountId
  };
}
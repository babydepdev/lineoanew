import { Message, Platform, SenderType } from '@prisma/client';
import { 
  MessageWithChat, 
  ConversationWithMessages,
  SerializedMessage,
  SerializedConversation 
} from '../types/chat';

// Map database message to chat message
export function mapMessageToChat(msg: Message): MessageWithChat {
  return {
    ...msg,
    chatType: msg.chatType || null,
    chatId: msg.chatId || null
  };
}

// Map API message to database message
export function mapApiMessageToMessage(msg: SerializedMessage): Message {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    content: msg.content,
    sender: msg.sender as SenderType,
    timestamp: new Date(msg.timestamp),
    platform: msg.platform as Platform,
    externalId: msg.externalId,
    chatType: msg.chatType,
    chatId: msg.chatId
  };
}

// Map database conversation to chat conversation
export function deserializeConversation(conv: SerializedConversation): ConversationWithMessages {
  return {
    id: conv.id,
    platform: conv.platform,
    channelId: conv.channelId,
    userId: conv.userId,
    messages: conv.messages.map(msg => ({
      ...mapApiMessageToMessage(msg),
      chatType: msg.chatType,
      chatId: msg.chatId
    })),
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt),
    lineAccountId: conv.lineAccountId || null
  };
}
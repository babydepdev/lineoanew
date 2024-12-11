import { Message, Platform, SenderType } from '@prisma/client';
import { 
  SerializedMessage,
  SerializedConversation,
  RuntimeConversation 
} from '@/app/types/chat';

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

export function deserializeConversation(conv: SerializedConversation): RuntimeConversation {
  return {
    id: conv.id,
    platform: conv.platform,
    channelId: conv.channelId,
    userId: conv.userId,
    messages: conv.messages.map(mapApiMessageToMessage),
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt),
    lineAccountId: conv.lineAccountId || null
  };
}
import { Message } from '@prisma/client';
import { MessageResponse } from '../types/api';
import { MessageWithChat, SerializedMessage } from '../types/chat';

export function mapApiMessageToMessage(msg: MessageResponse | SerializedMessage): MessageWithChat {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    content: msg.content,
    sender: msg.sender,
    timestamp: new Date(msg.timestamp),
    platform: msg.platform,
    externalId: msg.externalId,
    chatType: msg.chatType,
    chatId: msg.chatId,
    botId: msg.botId
  };
}

export function mapMessageToApi(msg: Message): MessageResponse {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    content: msg.content,
    sender: msg.sender,
    timestamp: msg.timestamp.toISOString(),
    platform: msg.platform,
    externalId: msg.externalId,
    chatType: msg.chatType,
    chatId: msg.chatId,
    botId: msg.botId
  };
}

export function mapMessageToSerialized(msg: Message): SerializedMessage {
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    content: msg.content,
    sender: msg.sender,
    timestamp: msg.timestamp.toISOString(),
    platform: msg.platform,
    externalId: msg.externalId,
    chatType: msg.chatType,
    chatId: msg.chatId,
    botId: msg.botId
  };
}
import { Platform, SenderType } from '@prisma/client';
import { BaseMessage } from './base';

export interface TempMessageParams {
  conversationId: string;
  content: string;
  sender: SenderType;
  platform: Platform;
}

export function createTempMessage(params: TempMessageParams): BaseMessage {
  return {
    id: `temp-${Date.now()}`,
    conversationId: params.conversationId,
    content: params.content,
    contentType: 'text',
    contentUrl: null,
    sender: params.sender,
    timestamp: new Date(),
    platform: params.platform,
    externalId: null,
    chatType: null,
    chatId: null
  };
}
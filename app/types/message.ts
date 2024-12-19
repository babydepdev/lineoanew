import { Message, Platform, SenderType } from '@prisma/client';

export type MessageContentType = 'text' | 'image';

export interface MessageContent {
  text?: string;
  image?: {
    url: string;
    previewUrl?: string;
  };
}

export interface MessageCreateParams {
  conversationId: string;
  content: string;
  contentType: MessageContentType;
  contentUrl?: string | null;
  sender: SenderType;
  platform: Platform;
  externalId?: string | null;
  timestamp?: Date;
  chatType?: string | null;
  chatId?: string | null;
}

export interface TempMessageParams {
  conversationId: string;
  content: string;
  sender: SenderType;
  platform: Platform;
}

export function createTempMessage(params: TempMessageParams): Message {
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
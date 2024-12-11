import { Platform, SenderType } from '@prisma/client';

export interface BaseMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderType;
  timestamp: Date;
  platform: Platform;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
  botId: string | null;
}

export interface TempMessage extends BaseMessage {
  id: string;
  isTemp?: boolean;
}

export const createTempMessage = (
  conversationId: string,
  content: string,
  platform: Platform
): TempMessage => ({
  id: `temp-${Date.now()}`,
  conversationId,
  content,
  sender: 'USER',
  timestamp: new Date(),
  platform,
  externalId: null,
  chatType: null,
  chatId: null,
  botId: null,
  isTemp: true
});
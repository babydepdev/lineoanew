import { Platform, SenderType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

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
  metadata: JsonValue;
}

export interface TempMessage extends Omit<BaseMessage, 'metadata'> {
  metadata: JsonValue | null;
}

export interface MessageCreateParams extends Omit<BaseMessage, 'id' | 'timestamp' | 'metadata'> {
  timestamp?: Date;
  metadata?: JsonValue;
}
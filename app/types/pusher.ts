import { Platform, SenderType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export interface PusherMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderType;
  timestamp: string;
  platform: Platform;
  externalId: string | null;
  chatType: string | null;
  chatId: string | null;
  metadata: JsonValue;
}

export interface PusherTypingEvent {
  conversationId: string;
  isTyping: boolean;
}

export type PusherClientEvent = PusherMessage | PusherTypingEvent;

export interface PusherChannel {
  trigger: (eventName: string, data: PusherClientEvent) => void;
  subscribed: boolean;
}
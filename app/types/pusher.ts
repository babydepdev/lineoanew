import { SerializedMessage } from './chat';

export interface PusherTypingEvent {
  conversationId: string;
  isTyping: boolean;
}

export type PusherClientEvent = SerializedMessage | PusherTypingEvent;

export interface PusherChannel {
  trigger: (eventName: string, data: PusherClientEvent) => void;
  subscribed: boolean;
}
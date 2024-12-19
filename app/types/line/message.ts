import { MessageEvent } from '@line/bot-sdk';

// Define supported message types
export type LineMessageType = 'text' | 'image';

// Base message interface
export interface BaseLineMessage {
  id: string;
  type: LineMessageType;
}

// Text message
export interface LineTextMessage extends BaseLineMessage {
  type: 'text';
  text: string;
}

// Image message
export interface LineImageMessage extends BaseLineMessage {
  type: 'image';
  contentProvider: {
    type: 'line' | 'external';
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
}

// Union type for all supported message types
export type LineMessage = LineTextMessage | LineImageMessage;

// Type guard for message events
export function isMessageEvent(event: unknown): event is MessageEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    (event as any).type === 'message'
  );
}
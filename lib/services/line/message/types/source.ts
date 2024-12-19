import {  MessageEvent } from '@line/bot-sdk';

// Define our own Source type since @line/bot-sdk doesn't export it
export interface LineSource {
  type: 'user' | 'group' | 'room';
  userId: string;
  groupId?: string;
  roomId?: string;
}

// Create a more specific type for our webhook events
export type LineWebhookEvent = MessageEvent & {
  source: LineSource;
};

export function validateSource(source: unknown): source is LineSource {
  if (!source || typeof source !== 'object') return false;

  const src = source as Record<string, unknown>;
  
  return (
    typeof src.type === 'string' &&
    ['user', 'group', 'room'].includes(src.type) &&
    typeof src.userId === 'string' &&
    src.userId.length > 0 &&
    (src.groupId === undefined || typeof src.groupId === 'string') &&
    (src.roomId === undefined || typeof src.roomId === 'string')
  );
}

export function getSourceId(source: LineSource): string {
  switch (source.type) {
    case 'user':
      return source.userId;
    case 'group':
      return source.groupId || source.userId;
    case 'room':
      return source.roomId || source.userId;
    default:
      return source.userId;
  }
}
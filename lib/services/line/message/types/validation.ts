import { WebhookEvent, MessageEvent } from '@line/bot-sdk';
import { LineSource } from './source';

// Type guard for webhook events
export function isWebhookEvent(event: unknown): event is WebhookEvent {
  if (!event || typeof event !== 'object') return false;
  
  const evt = event as Record<string, unknown>;
  return (
    typeof evt.type === 'string' &&
    typeof evt.timestamp === 'number' &&
    typeof evt.source === 'object'
  );
}

// Type guard for message events
export function isMessageEvent(event: WebhookEvent): event is MessageEvent {
  return (
    event.type === 'message' &&
    typeof event.message === 'object' &&
    event.message !== null &&
    'type' in event.message &&
    'id' in event.message
  );
}

// Validate source has required fields
export function hasValidSource(event: MessageEvent): event is MessageEvent & { source: LineSource } {
  const source = event.source;
  return (
    typeof source === 'object' &&
    source !== null &&
    typeof source.type === 'string' &&
    typeof source.userId === 'string' &&
    source.userId.length > 0
  );
}
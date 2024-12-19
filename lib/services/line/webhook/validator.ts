import { WebhookEvent } from '@line/bot-sdk';

export function validateWebhookBody(body: unknown): body is { events: WebhookEvent[] } {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const webhookBody = body as Record<string, unknown>;
  
  if (!Array.isArray(webhookBody.events)) {
    return false;
  }

  return webhookBody.events.every(event => 
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    'timestamp' in event
  );
}
import { LineWebhookBody } from '@/app/types/line';
import crypto from 'crypto';
import { LineChannelConfig } from '@/lib/config/lineChannels';

export async function validateLineWebhook(
  body: LineWebhookBody,
  channel: LineChannelConfig,
  signature: string
) {
  if (!body.events || !Array.isArray(body.events)) {
    throw new Error('Invalid webhook format: events array is missing or invalid');
  }

  // Verify webhook signature using channel secret
  const bodyString = JSON.stringify(body);
  const expectedSignature = crypto
    .createHmac('SHA256', channel.secret)
    .update(bodyString)
    .digest('base64');

  if (signature !== expectedSignature) {
    throw new Error('Invalid LINE webhook signature');
  }

  return {
    channel,
    events: body.events
  };
}
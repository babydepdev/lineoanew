import { LineWebhookBody } from '@/app/types/line';
import crypto from 'crypto';
import { getLineChannelById } from '@/lib/config/lineChannels';

export async function validateLineWebhook(
  body: LineWebhookBody,
  channelId: string,
  signature: string
) {
  if (!body.events || !Array.isArray(body.events)) {
    throw new Error('Invalid webhook format: events array is missing or invalid');
  }

  // Get channel configuration
  const channel = await getLineChannelById(channelId);
  if (!channel) {
    throw new Error(`LINE channel not found: ${channelId}`);
  }

  // Verify webhook signature
  const bodyString = JSON.stringify(body);
  const expectedSignature = crypto
    .createHmac('SHA256', channel.secret)
    .update(bodyString)
    .digest('base64');

  if (signature !== expectedSignature) {
    throw new Error('Invalid LINE webhook signature');
  }

  return {
    channelId: channel.id,
    events: body.events,
    channel
  };
}
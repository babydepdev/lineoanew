import { LineMessageEvent, LineAccount } from '@/app/types/line';
import { WebhookEventResult } from '../types';
import { validateLineMessage } from '../../message/validate';
import { createLineMessage } from '../../message/create';

export async function processMessageEvent(
  event: LineMessageEvent,
  account: LineAccount
): Promise<WebhookEventResult> {
  try {
    // Validate message
    const validation = validateLineMessage(event);
    if (!validation.isValid || !validation.text) {
      return {
        success: false,
        error: validation.error || 'Invalid message'
      };
    }

    // Process message
    const result = await createLineMessage({
      userId: event.source.userId,
      text: validation.text,
      messageId: event.message.id,
      timestamp: new Date(event.timestamp),
      channelId: event.source.roomId || event.source.groupId || event.source.userId,
      platform: 'LINE',
      lineAccountId: account.id,
      source: event.source,
      messageType: validation.messageType
    });

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error
    };
  } catch (error) {
    console.error('Error processing message event:', error);
    return {
      success: false,
      error: 'Message processing failed'
    };
  }
}
import { 
  LineMessageEvent, 
  LineAccount, 
  LineWebhookEventResult 
} from '@/app/types/line';
import { createLineMessage } from './message/create';
import { validateLineMessage } from './message/validate';

export async function processLineMessageEvent(
  event: LineMessageEvent,
  account: LineAccount
): Promise<LineWebhookEventResult> {
  try {
    // Validate message
    const validation = validateLineMessage(event);
    if (!validation.isValid || !validation.text) {
      return {
        success: false,
        error: validation.error || 'Invalid message'
      };
    }

    // Process valid message
    const result = await createLineMessage({
      userId: event.source.userId,
      text: validation.text,
      messageId: event.message.id,
      timestamp: new Date(event.timestamp),
      lineAccountId: account.id,
      platform: 'LINE',
      source: event.source,
      channelId: event.source.roomId || event.source.groupId || event.source.userId
    });

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error
    };
  } catch (error) {
    console.error('Error processing LINE message event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
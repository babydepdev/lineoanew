import { 
  LineMessageEvent, 
  LineAccount, 
  LineWebhookEventResult 
} from '@/app/types/line';
import { createLineMessage } from './message/create';
import { validateLineMessage } from './message/validate';
import { CreateLineMessageParams } from './message/types/createMessage';
import { storeReplyToken } from './message/sent';

export async function processLineMessageEvent(
  event: LineMessageEvent,
  account: LineAccount
): Promise<LineWebhookEventResult> {
  try {
    // Store reply token first
    if (event.replyToken) {
      console.log('Storing reply token from event:', {
        token: event.replyToken.substring(0, 8) + '...',
        timestamp: event.timestamp
      });
      storeReplyToken(event.replyToken, event.timestamp);
    }

    // Validate message
    const validation = validateLineMessage(event);
    if (!validation.isValid || !validation.text) {
      return {
        success: false,
        error: validation.error || 'Invalid message'
      };
    }

    // Process valid message with source information
    const messageParams: CreateLineMessageParams = {
      userId: event.source.userId,
      text: validation.text,
      messageId: event.message.id,
      timestamp: new Date(event.timestamp),
      channelId: event.source.roomId || event.source.groupId || event.source.userId,
      platform: 'LINE',
      lineAccountId: account.id,
      source: event.source,
      replyToken: event.replyToken // Add replyToken to message params
    };

    const result = await createLineMessage(messageParams);

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
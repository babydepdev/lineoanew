import { WebhookEvent } from '@line/bot-sdk';
import { LineAccount, LineWebhookEventResult } from '@/app/types/line';
import { isWebhookEvent, isMessageEvent, hasValidSource } from './message/types/validation';
import { validateLineMessage } from './message/validate';
import { createLineMessage } from './message/create';
import { getSourceId } from './message/types/source';
import { MessageParams } from './message/types/base';

export async function processLineMessageEvent(
  event: WebhookEvent,
  account: LineAccount
): Promise<LineWebhookEventResult> {
  try {
    // Validate webhook event
    if (!isWebhookEvent(event)) {
      return {
        success: false,
        error: 'Invalid webhook event format'
      };
    }

    // Validate message event
    if (!isMessageEvent(event)) {
      return {
        success: false,
        error: 'Not a message event'
      };
    }

    // Validate source
    if (!hasValidSource(event)) {
      return {
        success: false,
        error: 'Invalid source or missing userId'
      };
    }

    // Validate message content
    const validation = validateLineMessage(event);
    if (!validation.isValid || !validation.text) {
      return {
        success: false,
        error: validation.error || 'Invalid message'
      };
    }

    // Get channel ID from source
    const channelId = getSourceId(event.source);

    // Create message params based on message type
    const baseParams = {
      userId: event.source.userId,
      messageId: event.message.id,
      timestamp: new Date(event.timestamp),
      channelId,
      platform: 'LINE' as const,
      lineAccountId: account.id,
      source: event.source,
      messageType: validation.messageType
    };

    // Create type-specific message params
    const messageParams: MessageParams = validation.messageType === 'image'
      ? {
          ...baseParams,
          messageType: 'image',
          imageContent: JSON.parse(validation.text)
        }
      : {
          ...baseParams,
          messageType: 'text',
          text: validation.text
        };

    // Process valid message
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
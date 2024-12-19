import { 
  LineWebhookBody, 
  LineAccount 
} from '@/app/types/line';
import { WebhookProcessingResult } from './types';
import { processMessageEvent } from './events/message';
import { processFollowEvent } from './events/follow';
import { processUnfollowEvent } from './events/unfollow';

export async function processWebhookEvents(
  webhookBody: LineWebhookBody,
  account: LineAccount
): Promise<WebhookProcessingResult> {
  const results = await Promise.allSettled(
    webhookBody.events.map(event => processEvent(event, account))
  );

  const processedResults = results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      success: false,
      error: 'Failed to process event'
    };
  });

  return {
    processed: processedResults.filter(r => r.success).length,
    total: webhookBody.events.length,
    results: processedResults
  };
}

async function processEvent(event: any, account: LineAccount) {
  try {
    switch (event.type) {
      case 'message':
        return processMessageEvent(event, account);
      case 'follow':
        return processFollowEvent(event, account);
      case 'unfollow':
        return processUnfollowEvent(event, account);
      default:
        console.log('Unsupported event type:', event.type);
        return { success: true };
    }
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      success: false,
      error: 'Event processing failed'
    };
  }
}
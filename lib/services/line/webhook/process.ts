import { 
  LineWebhookBody, 
  LineAccount 
} from '@/app/types/line';
import { WebhookProcessingResult } from './types';
import { processMessageEvent } from './events/message';
import { processFollowEvent } from './events/follow';
import { processUnfollowEvent } from './events/unfollow';
import { broadcastAllConversations } from '@/lib/services/conversation/broadcast';

export async function processWebhookEvents(
  webhookBody: LineWebhookBody,
  account: LineAccount
): Promise<WebhookProcessingResult> {
  try {
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

    // Broadcast conversation updates after processing all events
    await broadcastAllConversations();

    return {
      processed: processedResults.filter(r => r.success).length,
      total: webhookBody.events.length,
      results: processedResults
    };
  } catch (error) {
    console.error('Error processing webhook events:', error);
    throw error;
  }
}

async function processEvent(event: any, account: LineAccount) {
  try {
    console.log('Processing LINE event:', { type: event.type, account: account.name });
    
    let result;
    switch (event.type) {
      case 'message':
        result = await processMessageEvent(event, account);
        break;
      case 'follow':
        result = await processFollowEvent(event, account);
        break;
      case 'unfollow':
        result = await processUnfollowEvent(event, account);
        break;
      default:
        console.log('Unsupported event type:', event.type);
        return { success: true };
    }

    return result;
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      success: false,
      error: 'Event processing failed'
    };
  }
}
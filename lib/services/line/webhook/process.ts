import { 
  LineWebhookBody, 
  LineAccount 
} from '@/app/types/line';
import { WebhookProcessingResult } from './types';
import { processMessageEvent } from './events/message';
import { processFollowEvent } from './events/follow';
import { processUnfollowEvent } from './events/unfollow';
import { broadcastAllConversations } from '@/lib/services/conversation/broadcast';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';

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

    // Get updated metrics
    const metrics = await getDashboardMetrics();

    // Broadcast updates to all clients
    await Promise.all([
      // Broadcast conversation updates
      broadcastAllConversations(),
      
      // Broadcast metrics update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        'metrics-updated',
        metrics
      ),

      // Broadcast conversations update event
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATIONS_UPDATED,
        { timestamp: new Date().toISOString() }
      )
    ]);

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
    console.log('Processing LINE event:', { 
      type: event.type, 
      account: account.name,
      timestamp: new Date().toISOString()
    });
    
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
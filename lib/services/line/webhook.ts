import { 
  LineWebhookBody, 
  LineAccount, 
  LineWebhookProcessingResult,
  LineMessageEvent
} from '@/app/types/line';
import { processLineMessageEvent } from './eventProcessor';
import { storeReplyToken } from './message/sent';

export async function processLineWebhook(
  webhookBody: LineWebhookBody,
  account: LineAccount
): Promise<LineWebhookProcessingResult> {
  // Store reply tokens for all message events
  webhookBody.events.forEach((event: LineMessageEvent) => {
    if (event.type === 'message' && event.replyToken) {
      storeReplyToken(event.replyToken, event.timestamp);
    }
  });

  const results = await Promise.allSettled(
    webhookBody.events.map(event => processLineMessageEvent(event, account))
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
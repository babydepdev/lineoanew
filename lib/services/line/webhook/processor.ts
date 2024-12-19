import { WebhookEvent } from '@line/bot-sdk';
import { LineAccount } from '@/app/types/line';
import { WebhookProcessingResult, WebhookEventResult } from './types';
import { processLineMessageEvent } from '../eventProcessor';

export async function processWebhookEvents(
  events: WebhookEvent[],
  account: LineAccount
): Promise<WebhookProcessingResult> {
  const results = await Promise.allSettled(
    events.map(event => processLineMessageEvent(event, account))
  );

  const processedResults = results.map<WebhookEventResult>(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      success: false,
      error: result.reason?.message || 'Failed to process event'
    };
  });

  return {
    processed: processedResults.filter(r => r.success).length,
    total: events.length,
    results: processedResults
  };
}
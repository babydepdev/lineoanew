import { 
  LineWebhookBody, 
  LineAccount, 
  LineWebhookProcessingResult 
} from '@/app/types/line';
import { processLineMessageEvent } from './eventProcessor';

export async function processLineWebhook(
  webhookBody: LineWebhookBody,
  account: LineAccount
): Promise<LineWebhookProcessingResult> {
  console.log('Processing LINE webhook events:', webhookBody.events.length);

  const results = await Promise.allSettled(
    webhookBody.events.map(async (event) => {
      try {
        // Skip redelivered messages
        if (event.deliveryContext?.isRedelivery) {
          console.log('Skipping redelivered message:', event.webhookEventId);
          return {
            success: false,
            error: 'Message redelivery skipped'
          };
        }

        return await processLineMessageEvent(event, account);
      } catch (error) {
        console.error('Error processing event:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
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

  const successCount = processedResults.filter(r => r.success).length;

  return {
    processed: successCount,
    total: webhookBody.events.length,
    results: processedResults
  };
}
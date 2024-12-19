import { LineAccount } from '@/app/types/line';
import { validateWebhookBody } from './webhook/validator';
import { processWebhookEvents } from './webhook/processor';
import { WebhookProcessingResult } from './webhook/types';

export async function processLineWebhook(
  webhookBody: unknown,
  account: LineAccount
): Promise<WebhookProcessingResult> {
  try {
    // Validate webhook body structure
    if (!validateWebhookBody(webhookBody)) {
      return {
        processed: 0,
        total: 0,
        results: [{
          success: false,
          error: 'Invalid webhook body format'
        }]
      };
    }

    // Process webhook events
    return await processWebhookEvents(webhookBody.events, account);
  } catch (error) {
    console.error('Error processing LINE webhook:', error);
    return {
      processed: 0,
      total: 0,
      results: [{
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]
    };
  }
}
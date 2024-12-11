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
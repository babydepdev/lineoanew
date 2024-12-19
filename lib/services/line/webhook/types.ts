import { WebhookEvent } from '@line/bot-sdk';
import { LineAccount } from '@/app/types/line';

export interface WebhookProcessingResult {
  processed: number;
  total: number;
  results: WebhookEventResult[];
}

export interface WebhookEventResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WebhookProcessorParams {
  event: WebhookEvent;
  account: LineAccount;
}
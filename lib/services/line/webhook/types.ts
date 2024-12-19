import { LineAccount } from '@/app/types/line';

export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
  account?: LineAccount;
}

export interface WebhookEventResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WebhookProcessingResult {
  processed: number;
  total: number;
  results: WebhookEventResult[];
}
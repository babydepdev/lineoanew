import { WebhookValidationResult } from './types';
import { findLineAccountBySignature } from '../account/verify';

export async function validateWebhookRequest(
  body: string,
  signature: string | null
): Promise<WebhookValidationResult> {
  try {
    // Check for signature
    if (!signature) {
      return {
        isValid: false,
        error: 'Missing LINE signature header',
        account: undefined
      };
    }

    // Verify signature and get account
    const verificationResult = await findLineAccountBySignature(body, signature);
    if (!verificationResult || !verificationResult.account) {
      return {
        isValid: false,
        error: 'Invalid signature or no matching account',
        account: undefined
      };
    }

    return {
      isValid: true,
      account: verificationResult.account
    };
  } catch (error) {
    console.error('Error validating webhook:', error);
    return {
      isValid: false,
      error: 'Webhook validation failed',
      account: undefined
    };
  }
}
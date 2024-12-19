import { SignatureVerificationResult } from '@/app/types/line';
import { findLineAccountBySignature } from '../account/verify';

export interface WebhookValidationResult extends SignatureVerificationResult {
  isValid: boolean;
  error?: string;
}

export async function validateWebhookRequest(
  body: string,
  signature: string | null
): Promise<WebhookValidationResult> {
  try {
    // Check for signature
    if (!signature) {
      return {
        isValid: false,
        error: 'Missing LINE signature header'
      };
    }

    // Verify signature and get account
    const verificationResult = await findLineAccountBySignature(body, signature);
    if (!verificationResult || !verificationResult.account) {
      return {
        isValid: false,
        error: 'Invalid signature or no matching account'
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
      error: 'Webhook validation failed'
    };
  }
}
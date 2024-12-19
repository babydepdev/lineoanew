import { createHmac, timingSafeEqual } from 'crypto';
import { WebhookValidationResult } from './types';
import { findLineAccountBySignature } from '../account/verify';

export async function validateWebhookRequest(
  body: string,
  signature: string | null
): Promise<WebhookValidationResult> {
  try {
    // Check for signature
    if (!signature) {
      console.error('Missing LINE signature header');
      return {
        isValid: false,
        error: 'Missing LINE signature header'
      };
    }

    // Verify signature and get account
    const verificationResult = await findLineAccountBySignature(body, signature);
    if (!verificationResult?.isValid || !verificationResult.account) {
      console.error('Invalid signature or no matching account');
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

export function verifySignature(
  body: string,
  signature: string,
  channelSecret: string
): boolean {
  try {
    // Create HMAC with channel secret
    const hmac = createHmac('SHA256', channelSecret);
    
    // Calculate signature from body
    const bodySignature = hmac.update(Buffer.from(body)).digest('base64');
    
    // Convert signatures to buffers for secure comparison
    const providedSigBuffer = Buffer.from(signature);
    const calculatedSigBuffer = Buffer.from(bodySignature);
    
    // Use timing-safe comparison
    return providedSigBuffer.length === calculatedSigBuffer.length &&
           timingSafeEqual(providedSigBuffer, calculatedSigBuffer);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}
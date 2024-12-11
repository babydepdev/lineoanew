import { createHmac, timingSafeEqual } from 'crypto';

export function verifyLineSignature(
  body: string,
  signature: string | null,
  channelSecret: string
): boolean {
  try {
    if (!signature || !channelSecret) {
      console.error('Missing signature or channel secret');
      return false;
    }

    // Create HMAC with channel secret
    const hmac = createHmac('SHA256', channelSecret);
    
    // Calculate signature from body
    const bodySignature = hmac.update(Buffer.from(body)).digest('base64');
    
    // Convert signatures to buffers for secure comparison
    const providedSigBuffer = Buffer.from(signature);
    const calculatedSigBuffer = Buffer.from(bodySignature);
    
    console.log('Signature verification:', {
      provided: signature,
      calculated: bodySignature,
      matches: providedSigBuffer.length === calculatedSigBuffer.length
    });

    // Use timing-safe comparison
    return providedSigBuffer.length === calculatedSigBuffer.length &&
           timingSafeEqual(providedSigBuffer, calculatedSigBuffer);
  } catch (error) {
    console.error('Error verifying LINE signature:', error);
    return false;
  }
}

export function extractLineSignature(header: string | null): string | null {
  if (!header) {
    console.log('No signature header found');
    return null;
  }

  const signature = header.trim();
  console.log('Extracted signature:', signature);
  return signature;
}
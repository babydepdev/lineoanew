import { createHmac, timingSafeEqual } from 'crypto';

export function verifyLineSignature(
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
    
    console.log('Signature verification details:', {
      providedSignature: signature,
      calculatedSignature: bodySignature,
      channelSecretLength: channelSecret.length,
      bodyLength: body.length
    });

    // Use timing-safe comparison
    const matches = providedSigBuffer.length === calculatedSigBuffer.length &&
                   timingSafeEqual(providedSigBuffer, calculatedSigBuffer);

    console.log('Signature verification result:', { matches });
    return matches;
  } catch (error) {
    console.error('Error verifying LINE signature:', error);
    return false;
  }
}

export function extractLineSignature(signature: string | null): string | null {
  if (!signature) {
    console.log('No signature header found');
    return null;
  }

  console.log('Raw signature header:', signature);
  return signature;
}
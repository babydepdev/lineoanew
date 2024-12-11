import { createHmac, timingSafeEqual } from 'crypto';

export function verifyLineSignature(
  body: string,
  signature: string,
  channelSecret: string
): boolean {
  try {
    const hmac = createHmac('SHA256', channelSecret);
    const bodySignature = hmac.update(Buffer.from(body)).digest('base64');
    
    const providedSigBuffer = Buffer.from(signature);
    const calculatedSigBuffer = Buffer.from(bodySignature);
    
    return providedSigBuffer.length === calculatedSigBuffer.length &&
           timingSafeEqual(providedSigBuffer, calculatedSigBuffer);
  } catch (error) {
    console.error('Error verifying LINE signature:', error);
    return false;
  }
}

export function extractLineSignature(header: string | null): string | null {
  if (!header) return null;
  return header.trim();
}
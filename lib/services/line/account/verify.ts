import { SignatureVerificationResult } from '@/app/types/line';
import { getActiveLineAccounts } from './find';
import { verifyLineSignature } from '../signature';

export async function findLineAccountBySignature(
  body: string,
  signature: string | null
): Promise<SignatureVerificationResult | null> {
  try {
    if (!signature) {
      console.error('No signature provided');
      return null;
    }

    const accounts = await getActiveLineAccounts();
    console.log('Checking signature against accounts:', accounts.length);

    for (const account of accounts) {
      console.log('Verifying against account:', account.id);
      
      const isValid = verifyLineSignature(body, signature, account.channelSecret);
      
      if (isValid) {
        console.log('Found matching account:', account.id);
        return { 
          account,
          isValid: true
        };
      }
    }

    console.log('No matching account found');
    return null;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return null;
  }
}
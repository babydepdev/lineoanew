import { SignatureVerificationResult } from '@/app/types/line';
import { getActiveLineAccounts } from './find';
import { verifySignature } from '../webhook/validate';

export async function findLineAccountBySignature(
  body: string,
  signature: string
): Promise<SignatureVerificationResult | null> {
  try {
    // Get all active LINE accounts
    const accounts = await getActiveLineAccounts();
    console.log('Checking signature against accounts:', accounts.length);

    // Try each account's channel secret
    for (const account of accounts) {
      console.log('Verifying against account:', account.id);
      
      const isValid = verifySignature(body, signature, account.channelSecret);
      
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
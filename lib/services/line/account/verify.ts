import { SignatureVerificationResult } from '@/app/types/line';
import { getActiveLineAccounts } from './find';
import { verifyLineSignature } from '../signature';

export async function findLineAccountBySignature(
  body: string,
  signature: string
): Promise<SignatureVerificationResult | null> {
  try {
    const accounts = await getActiveLineAccounts();
    console.log('Active LINE accounts found:', accounts.length);

    for (const account of accounts) {
      console.log('Verifying signature for account:', {
        id: account.id,
        name: account.name
      });

      const isValid = verifyLineSignature(body, signature, account.channelSecret);
      
      if (isValid) {
        console.log('Found matching account:', {
          id: account.id,
          name: account.name
        });
        return { account, isValid: true };
      }
    }

    console.log('No matching account found for signature');
    return null;
  } catch (error) {
    console.error('Error finding LINE account:', error);
    return null;
  }
}
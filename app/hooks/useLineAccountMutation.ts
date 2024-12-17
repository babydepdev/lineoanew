import { useState } from 'react';
import { LineAccount } from '../types/line';

interface LineAccountMutationParams {
  name: string;
  channelAccessToken: string;
  channelSecret: string;
}

interface UseLineAccountMutationResult {
  mutate: (params: LineAccountMutationParams, options?: { onSuccess?: () => void }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useLineAccountMutation(): UseLineAccountMutationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    params: LineAccountMutationParams, 
    options?: { onSuccess?: () => void }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/line/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create LINE account');
      }

      const account: LineAccount = await response.json();
      console.log('LINE account created:', account);
      
      options?.onSuccess?.();
    } catch (err) {
      console.error('Error creating LINE account:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}
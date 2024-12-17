import { useState, useEffect } from 'react';
import { LineAccount } from '../types/line';

interface UseLineAccountsResult {
  accounts: LineAccount[];
  isLoading: boolean;
  error: Error | null;
}

export function useLineAccounts(): UseLineAccountsResult {
  const [accounts, setAccounts] = useState<LineAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch('/api/line/accounts');
        if (!response.ok) throw new Error('Failed to fetch LINE accounts');
        
        const data = await response.json();
        setAccounts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setAccounts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  return { accounts, isLoading, error };
}
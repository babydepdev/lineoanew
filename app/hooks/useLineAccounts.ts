import { useState, useEffect, useCallback } from 'react';
import { LineAccount } from '../types/line';

interface UseLineAccountsResult {
  accounts: LineAccount[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<void>;
}

export function useLineAccounts(): UseLineAccountsResult {
  const [accounts, setAccounts] = useState<LineAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await fetch('/api/line/accounts');
      if (!response.ok) throw new Error('Failed to fetch LINE accounts');
      
      const data = await response.json();
      // Ensure we get the full account details including companyName
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {

    fetchAccounts();
  }, []);

  return { 
    accounts, 
    isLoading, 
    error,
    mutate: fetchAccounts 
  };
}
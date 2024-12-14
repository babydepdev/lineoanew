"use client";

import { useState, useEffect } from 'react';
import { LineAccount } from '@/app/types/line';

interface UseLineAccountResult {
  account: LineAccount | null;
  isLoading: boolean;
  error: Error | null;
}

export function useLineAccount(accountId?: string | null): UseLineAccountResult {
  const [account, setAccount] = useState<LineAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!accountId) {
      setAccount(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    async function fetchAccount() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/line/accounts/${accountId}`, {
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error('Failed to fetch LINE account');
        if (!mounted) return;
        
        const data = await response.json();
        setAccount(data);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        if (err instanceof Error && err.name === 'AbortError') return;
        
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setAccount(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAccount();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [accountId]);

  return { account, isLoading, error };
}
import { useState, useEffect, useCallback, useRef } from 'react';
import { Quotation } from '../types/quotation';

interface UseQuotationsByAccountResult {
  quotations: Quotation[];
  isLoading: boolean;
  mutate: () => Promise<void>;
}

interface QuotationResponse extends Omit<Quotation, 'createdAt'> {
  createdAt: string;
}

export function useQuotationsByAccount(accountId: string): UseQuotationsByAccountResult {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerRef = useRef<AbortController>();

  const fetchQuotations = useCallback(async () => {
    if (!accountId) {
      setQuotations([]);
      setIsLoading(false);
      return;
    }

    try {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      const response = await fetch(`/api/quotations?accountId=${accountId}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) throw new Error('Failed to fetch quotations');
      
      const data = await response.json() as QuotationResponse[];
      const sortedQuotations = data
        .map((quotation) => ({
          ...quotation,
          createdAt: new Date(quotation.createdAt)
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setQuotations(sortedQuotations);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Ignore abort errors
        return;
      }
      console.error('Error fetching quotations:', error);
      setQuotations([]);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch quotations when accountId changes
  useEffect(() => {
    fetchQuotations();
  }, [accountId, fetchQuotations]);

  return { 
    quotations, 
    isLoading,
    mutate: fetchQuotations
  };
}
import { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuotations = useCallback(async () => {
    if (!accountId) {
      setQuotations([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/quotations?accountId=${accountId}`);
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
      console.error('Error fetching quotations:', error);
      setQuotations([]);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  // Only fetch when accountId changes
  useEffect(() => {
    if (accountId) {
      fetchQuotations();
    }
  }, [accountId, fetchQuotations]);

  return { 
    quotations, 
    isLoading,
    mutate: fetchQuotations
  };
}
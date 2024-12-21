import { useState, useEffect } from 'react';
import { Quotation } from '../types/quotation';

interface UseQuotationsByAccountResult {
  quotations: Quotation[];
  isLoading: boolean;
  mutate: () => Promise<void>;
}

export function useQuotationsByAccount(accountId: string): UseQuotationsByAccountResult {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuotations = async () => {
    if (!accountId) {
      setQuotations([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/quotations?accountId=${accountId}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch quotations');
      
      const data = await response.json();
      const sortedQuotations = data
        .map((quotation: any) => ({
          ...quotation,
          createdAt: new Date(quotation.createdAt)
        }))
        .sort((a: Quotation, b: Quotation) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );

      setQuotations(sortedQuotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setQuotations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [accountId]);

  return {
    quotations,
    isLoading,
    mutate: fetchQuotations
  };
}
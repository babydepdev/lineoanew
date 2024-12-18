import { useState, useEffect, useCallback } from 'react';
import { Quotation } from '../types/quotation';

export function useQuotationsByAccount(accountId: string) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuotations = useCallback(async () => {
    if (!accountId) {
      setQuotations([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/quotations?accountId=${accountId}`);
      if (!response.ok) throw new Error('Failed to fetch quotations');
      
      const data = await response.json();
      const sortedQuotations = data
        .map((q: any) => ({
          ...q,
          createdAt: new Date(q.createdAt)
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
  }, [accountId]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  return { 
    quotations, 
    isLoading,
    mutate: fetchQuotations
  };
}
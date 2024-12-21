import { useState, useEffect } from 'react';
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

  const fetchQuotations = async () => {
    if (!accountId) {
      setQuotations([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/quotations?accountId=${accountId}`);
      if (!response.ok) throw new Error('Failed to fetch quotations');
      
      const data = await response.json() as QuotationResponse[];
      
      // Ensure we're getting unique quotations by ID
      const uniqueQuotations = Array.from(
        new Map(data.map(q => [q.id, q])).values()
      );
      
      const sortedQuotations = uniqueQuotations
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
  };

  // Fetch quotations when accountId changes
  useEffect(() => {
    fetchQuotations();
  }, [accountId]);

  return { 
    quotations, 
    isLoading,
    mutate: fetchQuotations
  };
}
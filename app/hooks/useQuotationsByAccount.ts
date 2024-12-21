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
      
      // Map the quotations and ensure dates are properly converted
      const processedQuotations = data.map((quotation) => ({
        ...quotation,
        createdAt: new Date(quotation.createdAt)
      }));

      // Sort by creation date descending
      const sortedQuotations = processedQuotations.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

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
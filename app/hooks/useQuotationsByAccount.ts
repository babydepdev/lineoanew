import { useState, useEffect } from 'react';
import { Quotation } from '../types/quotation';

export function useQuotationsByAccount(accountId: string) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotations() {
      try {
        const response = await fetch(`/api/quotations?accountId=${accountId}`);
        if (!response.ok) throw new Error('Failed to fetch quotations');
        
        const data = await response.json();
        setQuotations(data.map((q: any) => ({
          ...q,
          createdAt: new Date(q.createdAt)
        })));
      } catch (error) {
        console.error('Error fetching quotations:', error);
        setQuotations([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuotations();
  }, [accountId]);

  return { quotations, isLoading };
}
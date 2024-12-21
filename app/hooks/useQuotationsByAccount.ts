import { useState, useEffect } from 'react';
import { QuotationWithItems } from '@/lib/services/quotation/types';
import { pusherClient, PUSHER_CHANNELS } from '@/lib/pusher';

interface UseQuotationsByAccountResult {
  quotations: QuotationWithItems[];
  isLoading: boolean;
  mutate: () => Promise<void>;
}

export function useQuotationsByAccount(accountId: string): UseQuotationsByAccountResult {
  const [quotations, setQuotations] = useState<QuotationWithItems[]>([]);
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
      
      if (!response.ok) {
        throw new Error('Failed to fetch quotations');
      }
      
      const data = await response.json();
      const formattedQuotations = data.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt)
      }));

      setQuotations(formattedQuotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setQuotations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to Pusher events
  useEffect(() => {
    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleQuotationUpdate = () => {
      fetchQuotations();
    };

    channel.bind('quotation-created', handleQuotationUpdate);
    channel.bind('quotation-updated', handleQuotationUpdate);
    channel.bind('quotation-deleted', handleQuotationUpdate);

    return () => {
      channel.unbind('quotation-created', handleQuotationUpdate);
      channel.unbind('quotation-updated', handleQuotationUpdate);
      channel.unbind('quotation-deleted', handleQuotationUpdate);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [accountId]);

  // Initial fetch
  useEffect(() => {
    fetchQuotations();
  }, [accountId]);

  return { 
    quotations, 
    isLoading,
    mutate: fetchQuotations
  };
}
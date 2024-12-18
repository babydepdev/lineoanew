import { create } from 'zustand';
import { Quotation } from '../types/quotation';

interface QuotationsState {
  quotations: Record<string, Quotation[]>;
  setQuotations: (accountId: string, quotations: Quotation[]) => void;
  addQuotation: (accountId: string, quotation: Quotation) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useQuotationsStore = create<QuotationsState>((set) => ({
  quotations: {},
  isLoading: false,
  setQuotations: (accountId, quotations) => 
    set((state) => ({
      quotations: {
        ...state.quotations,
        [accountId]: quotations,
      },
    })),
  addQuotation: (accountId, quotation) =>
    set((state) => ({
      quotations: {
        ...state.quotations,
        [accountId]: [
          quotation,
          ...(state.quotations[accountId] || []),
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      },
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export function useQuotations(accountId: string) {
  const store = useQuotationsStore();
  
  const fetchQuotations = async () => {
    if (!accountId) return;
    
    store.setIsLoading(true);
    try {
      const response = await fetch(`/api/quotations?accountId=${accountId}`);
      if (!response.ok) throw new Error('Failed to fetch quotations');
      
      const data = await response.json();
      const formattedQuotations = data.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt)
      }));
      
      store.setQuotations(accountId, formattedQuotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      store.setQuotations(accountId, []);
    } finally {
      store.setIsLoading(false);
    }
  };

  return {
    quotations: store.quotations[accountId] || [],
    isLoading: store.isLoading,
    addQuotation: (quotation: Quotation) => store.addQuotation(accountId, quotation),
    refresh: fetchQuotations,
  };
}
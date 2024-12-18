import { Quotation } from '../types/quotation';

export function filterQuotations(quotations: Quotation[], searchQuery: string): Quotation[] {
  if (!searchQuery) return quotations;

  const query = searchQuery.toLowerCase();
  return quotations.filter((quotation) => {
    return (
      quotation.customerName.toLowerCase().includes(query) ||
      quotation.number.toLowerCase().includes(query) ||
      quotation.items.some(item => 
        item.name.toLowerCase().includes(query)
      )
    );
  });
}
"use client";

import { LineAccount } from '@/app/types/line';
import { useQuotationsByAccount } from '@/app/hooks/useQuotationsByAccount';
import { QuotationItem } from './QuotationItem';
import { Quotation } from '@/app/types/quotation';

interface QuotationSectionProps {
  account: LineAccount;
  searchQuery: string;
}

export function QuotationSection({ account, searchQuery }: QuotationSectionProps) {
  const { quotations, isLoading, mutate } = useQuotationsByAccount(account.id);

  if (isLoading) {
    return <QuotationSectionSkeleton name={account.name} />;
  }

  const filteredQuotations = filterQuotations(quotations, searchQuery);

  if (!filteredQuotations?.length) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">{account.name}</h3>
        <p className="text-sm text-slate-500">ไม่มีใบเสนอราคา</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{account.name}</h3>
        <span className="text-sm text-slate-500">
          {filteredQuotations.length} รายการ
        </span>
      </div>
      <div className="space-y-2">
        {filteredQuotations.map((quotation) => (
          <QuotationItem 
            key={quotation.id} 
            quotation={quotation}
            onUpdate={mutate}
          />
        ))}
      </div>
    </div>
  );
}

function QuotationSectionSkeleton({ name }: { name: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-50 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function filterQuotations(quotations: Quotation[], query: string): Quotation[] {
  if (!query) return quotations;

  const searchTerms = query.toLowerCase().split(' ');
  
  return quotations.filter(quotation => {
    const searchText = [
      quotation.customerName,
      quotation.number,
      ...quotation.items.map(item => item.name)
    ].join(' ').toLowerCase();

    return searchTerms.every(term => searchText.includes(term));
  });
}
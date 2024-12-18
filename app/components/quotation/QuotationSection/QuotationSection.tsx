import { LineAccount } from '@/app/types/line';
import { useQuotationsByAccount } from '@/app/hooks/useQuotationsByAccount';
import { QuotationItem } from '../QuotationItem';
import { filterQuotations } from '@/app/utils/quotationUtils';
import { QuotationSectionSkeleton } from './QuotationSectionSkeleton';

interface QuotationSectionProps {
  account: LineAccount;
  searchQuery: string;
  refreshTrigger: number;
}

export function QuotationSection({ 
  account, 
  searchQuery,
  refreshTrigger 
}: QuotationSectionProps) {
  const { quotations, isLoading, mutate } = useQuotationsByAccount(account.id, refreshTrigger);

  if (isLoading) {
    return <QuotationSectionSkeleton name={account.name} />;
  }

  const filtered = filterQuotations(quotations, searchQuery);

  if (!filtered?.length) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">{account.name}</h3>
        <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-lg text-center">
          ไม่มีใบเสนอราคา
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{account.name}</h3>
        <span className="text-sm text-slate-500">
          {filtered.length} รายการ
        </span>
      </div>
      <div className="space-y-2">
        {filtered.map((quotation) => (
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
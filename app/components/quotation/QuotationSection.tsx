import { LineAccount } from '@/app/types/line';
import { useQuotationsByAccount } from '@/app/hooks/useQuotationsByAccount';
import { QuotationItem } from './QuotationItem';

interface QuotationSectionProps {
  account: LineAccount;
}

export function QuotationSection({ account }: QuotationSectionProps) {
  const { quotations, isLoading } = useQuotationsByAccount(account.id);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">{account.name}</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!quotations?.length) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">{account.name}</h3>
        <p className="text-sm text-slate-500">ไม่มีใบเสนอราคา</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">{account.name}</h3>
      <div className="space-y-2">
        {quotations.map((quotation) => (
          <QuotationItem 
            key={quotation.id} 
            quotation={quotation}
          />
        ))}
      </div>
    </div>
  );
}
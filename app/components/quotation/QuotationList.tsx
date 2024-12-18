import { useLineAccounts } from '@/app/hooks/useLineAccounts';
import { QuotationSection } from './QuotationSection';
import { ScrollArea } from '../ui/scroll-area';

export function QuotationList() {
  const { accounts, isLoading } = useLineAccounts();

  if (isLoading) {
    return <QuotationListSkeleton />;
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        {accounts.map((account) => (
          <QuotationSection 
            key={account.id} 
            account={account}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

function QuotationListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 bg-slate-100 rounded w-48 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-16 bg-slate-50 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
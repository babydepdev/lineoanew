import { useLineAccounts } from '@/app/hooks/useLineAccounts';
import { QuotationSection } from './QuotationSection';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function QuotationList() {
  const { accounts, isLoading } = useLineAccounts();
  const [searchQuery, setSearchQuery] = useState('');

  // Show skeleton only once during initial load
  if (isLoading) {
    return <QuotationListSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="ค้นหาใบเสนอราคา..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] sm:h-[600px] pr-4">
        <div className="space-y-6">
          {accounts.map((account) => (
            <QuotationSection 
              key={account.id} 
              account={account}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function QuotationListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-slate-100 rounded" />
      {[1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 bg-slate-100 rounded w-48" />
          <div className="space-y-3">
            {[1, 2].map((j) => (
              <div key={j} className="h-16 bg-slate-50 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
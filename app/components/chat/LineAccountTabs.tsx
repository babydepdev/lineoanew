import { useState } from 'react';
import { LineAccount } from '@/app/types/line';
import { cn } from '@/lib/utils';
import { useLineAccounts } from '@/app/hooks/useLineAccounts';

interface LineAccountTabsProps {
  selectedAccountId: string | null;
  onAccountSelect: (accountId: string | null) => void;
}

export function LineAccountTabs({ selectedAccountId, onAccountSelect }: LineAccountTabsProps) {
  const { accounts, isLoading } = useLineAccounts();

  if (isLoading) {
    return (
      <div className="px-4 py-2 border-b border-slate-200">
        <div className="h-8 bg-slate-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="px-4 border-b border-slate-200">
      <div className="flex space-x-2 overflow-x-auto py-2">
        <button
          onClick={() => onAccountSelect(null)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap",
            "transition-colors duration-200",
            selectedAccountId === null
              ? "bg-primary text-primary-foreground"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          All Accounts
        </button>
        {accounts.map((account) => (
          <button
            key={account.id}
            onClick={() => onAccountSelect(account.id)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap",
              "transition-colors duration-200",
              selectedAccountId === account.id
                ? "bg-primary text-primary-foreground"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {account.name}
          </button>
        ))}
      </div>
    </div>
  );
}
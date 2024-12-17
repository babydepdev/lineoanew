import { useLineAccounts } from '@/app/hooks/useLineAccounts';
import { cn } from '@/lib/utils';

interface LineAccountTabsProps {
  selectedAccountId: string | null;
  onAccountSelect: (accountId: string | null) => void;
}

export function LineAccountTabs({ 
  selectedAccountId, 
  onAccountSelect 
}: LineAccountTabsProps) {
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
      <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
        <Tab
          isSelected={selectedAccountId === null}
          onClick={() => onAccountSelect(null)}
          label="All Accounts"
        />
        {accounts.map((account) => (
          <Tab
            key={account.id}
            isSelected={selectedAccountId === account.id}
            onClick={() => onAccountSelect(account.id)}
            label={account.name}
          />
        ))}
      </div>
    </div>
  );
}

interface TabProps {
  isSelected: boolean;
  onClick: () => void;
  label: string;
}

function Tab({ isSelected, onClick, label }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap",
        "transition-colors duration-200",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      )}
    >
      {label}
    </button>
  );
}
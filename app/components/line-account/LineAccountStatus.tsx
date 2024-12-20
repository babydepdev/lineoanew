import { useLineAccounts } from '@/app/hooks/useLineAccounts';

export function LineAccountStatus() {
  const { accounts, isLoading } = useLineAccounts();

  if (isLoading) {
    return (
      <div className="fixed bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
        <div className="h-2 w-2 rounded-full bg-slate-200 animate-pulse" />
        <span className="text-xs text-slate-500">Loading accounts...</span>
      </div>
    );
  }

  if (!accounts.length) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-xs text-slate-700 font-medium">
        {accounts.length} LINE {accounts.length === 1 ? 'Account' : 'Accounts'} Connected
      </span>
    </div>
  );
}
import { useLineAccounts } from '@/app/hooks/useLineAccounts';
import { LineAccountSettingsCard } from './LineAccountSettingsCard';

export function LineAccountSettingsPage() {
  const { accounts, isLoading, mutate } = useLineAccounts();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-slate-100 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">LINE Account Settings</h1>
      <div className="grid gap-6">
        {accounts.map((account) => (
          <LineAccountSettingsCard 
            key={account.id} 
            account={account} 
            onUpdate={mutate}
          />
        ))}
      </div>
    </div>
  );
}
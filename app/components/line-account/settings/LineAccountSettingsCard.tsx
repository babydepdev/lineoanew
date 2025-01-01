import { LineAccount } from '@/app/types/line';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Settings, Key } from 'lucide-react';

interface LineAccountSettingsCardProps {
  account: LineAccount;
}

export function LineAccountSettingsCard({ account }: LineAccountSettingsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{account.name}</h2>
            <Badge variant={account.active ? "success" : "secondary"}>
              {account.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-500">Channel Secret</label>
              <div className="mt-1 flex items-center gap-2">
                <div className="px-3 py-1.5 bg-slate-50 rounded text-sm font-mono text-slate-600">
                  {account.channelSecret.slice(0, 8)}...
                </div>
                <Key className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Access Token</label>
              <div className="mt-1 flex items-center gap-2">
                <div className="px-3 py-1.5 bg-slate-50 rounded text-sm font-mono text-slate-600">
                  {account.channelAccessToken.slice(0, 8)}...
                </div>
                <Key className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Edit</span>
        </Button>
      </div>
    </div>
  );
}
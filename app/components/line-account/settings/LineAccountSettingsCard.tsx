import { LineAccount } from '@/app/types/line';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Settings, Key } from 'lucide-react';
import { useState } from 'react';
import { LineAccountSettingsDialog } from './LineAccountSettingsDialog';

interface LineAccountSettingsCardProps {
  account: LineAccount;
  onUpdate: () => void;
}

export function LineAccountSettingsCard({ account, onUpdate }: LineAccountSettingsCardProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {account.imageUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={account.imageUrl} 
                alt={account.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{account.name}</h2>
            <Badge variant={account.active ? "success" : "secondary"}>
              {account.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-slate-500 mt-0.5">{account.companyName || 'No company name set'}</p>
          </div>
          <div className="mt-4 space-y-3">
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
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span className=" text-slate-500">Edit</span>
        </Button>
      </div>
    </div>
    
    <LineAccountSettingsDialog
      account={account}
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      onUpdate={onUpdate}
    />
    </>
  );
}
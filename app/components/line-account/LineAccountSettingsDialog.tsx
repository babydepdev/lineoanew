import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useLineAccount } from '@/app/hooks/useLineAccount';

interface LineAccountSettingsDialogProps {
  accountId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LineAccountSettingsDialog({
  accountId,
  isOpen,
  onClose
}: LineAccountSettingsDialogProps) {
  const { account, isLoading } = useLineAccount(accountId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>LINE Account Settings</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
            </div>
          ) : account ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500">Account Name</label>
                <p className="mt-1 text-base text-slate-900">{account.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Status</label>
                <p className="mt-1 text-base text-slate-900">
                  {account.active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Account not found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { LineAccount } from '@/app/types/line';
import { showToast } from '@/app/utils/toast';

interface LineAccountSettingsDialogProps {
  account: LineAccount;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function LineAccountSettingsDialog({
  account,
  isOpen,
  onClose,
  onUpdate
}: LineAccountSettingsDialogProps) {
  const [companyName, setCompanyName] = useState(account.companyName || '');
  const [imageUrl, setImageUrl] = useState(account.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log(imageUrl)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/line/accounts/${account.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          companyName: companyName.trim(),
          imageUrl: imageUrl 
        }) 
      });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      showToast.success('Account updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating account:', error);
      showToast.error('Failed to update account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>LINE Account Settings</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Account Image
            </label>
            <ImageUpload 
              onUpload={setImageUrl}
              currentImage={imageUrl || account.imageUrl}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Company/Shop Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter company or shop name"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving....' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
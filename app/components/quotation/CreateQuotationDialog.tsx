import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useLineAccounts } from '@/app/hooks/useLineAccounts';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CreateQuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateQuotationDialog({ isOpen, onClose }: CreateQuotationDialogProps) {
  const { accounts } = useLineAccounts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    lineAccountId: '',
    customerName: '',
    items: [{ name: '', quantity: 1, price: 0 }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create quotation');
      onClose();
    } catch (error) {
      console.error('Error creating quotation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>สร้างใบเสนอราคา</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>LINE Account</Label>
            <Select 
              value={formData.lineAccountId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, lineAccountId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือก LINE Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>ชื่อลูกค้า</Label>
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="ระบุชื่อลูกค้า"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'กำลังสร้าง...' : 'สร้างใบเสนอราคา'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
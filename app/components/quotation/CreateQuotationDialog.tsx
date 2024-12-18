import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { QuotationItemInputs } from './QuotationItemInputs';
import { AccountSelect } from './AccountSelect';
import { useQuotationsByAccount } from '@/app/hooks/useQuotationsByAccount';
import { toast } from 'sonner';

interface CreateQuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateQuotationDialog({ isOpen, onClose }: CreateQuotationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    lineAccountId: '',
    customerName: '',
    items: [{ name: '', quantity: 1, price: 0 }]
  });

  // Get the mutate function from the hook to refresh quotations
  const { mutate: refreshQuotations } = useQuotationsByAccount(formData.lineAccountId);

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
      
      // Refresh quotations for the selected account
      await refreshQuotations();
      
      toast.success('สร้างใบเสนอราคาสำเร็จ', {
        description: 'ใบเสนอราคาถูกสร้างเรียบร้อยแล้ว'
      });

      setFormData({
        lineAccountId: '',
        customerName: '',
        items: [{ name: '', quantity: 1, price: 0 }]
      });

      onClose();
    } catch (error) {
      console.error('Error creating quotation:', error);
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถสร้างใบเสนอราคาได้'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>สร้างใบเสนอราคา</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>LINE Account</Label>
              <AccountSelect
                value={formData.lineAccountId}
                onChange={(value) => setFormData(prev => ({ ...prev, lineAccountId: value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>ชื่อลูกค้า</Label>
              <Input
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="ระบุชื่อลูกค้า"
                className="h-11"
              />
            </div>
          </div>

          <QuotationItemInputs 
            items={formData.items}
            onChange={(items) => setFormData(prev => ({ ...prev, items }))}
          />

          <div className="flex justify-end gap-2 pt-4 border-t">
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
import { useState, useCallback, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { QuotationItemInputs } from './QuotationItemInputs';
import { AccountSelect } from './AccountSelect';
import { useQuotationsByAccount } from '@/app/hooks/useQuotationsByAccount';
import { showToast } from '@/app/utils/toast';

// Memoize form components
const MemoizedAccountSelect = memo(AccountSelect);
const MemoizedQuotationItemInputs = memo(QuotationItemInputs);

export interface CreateQuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;  // Add onSuccess to props interface
}

export function CreateQuotationDialog({ 
  isOpen, 
  onClose,
  onSuccess 
}: CreateQuotationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    lineAccountId: '',
    customerName: '',
    items: [{ name: '', quantity: 1, price: 0 }]
  });

  const { mutate: refreshQuotations } = useQuotationsByAccount(formData.lineAccountId);

  // Memoize handlers
  const handleAccountChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, lineAccountId: value }));
  }, []);

  const handleCustomerNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, customerName: e.target.value }));
  }, []);

  const handleItemsChange = useCallback((items: any[]) => {
    setFormData(prev => ({ ...prev, items }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create quotation');
      
      await refreshQuotations();
      
      showToast.success('สร้างใบเสนอราคาสำเร็จ', {
        description: 'ใบเสนอราคาถูกสร้างเรียบร้อยแล้ว'
      });

      setFormData({
        lineAccountId: '',
        customerName: '',
        items: [{ name: '', quantity: 1, price: 0 }]
      });

      onSuccess(); // Call onSuccess after successful creation
    } catch (error) {
      console.error('Error creating quotation:', error);
      showToast.error('เกิดข้อผิดพลาด', {
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
              <MemoizedAccountSelect
                value={formData.lineAccountId}
                onChange={handleAccountChange}
              />
            </div>

            <div className="space-y-2">
              <Label>ชื่อลูกค้า</Label>
              <Input
                value={formData.customerName}
                onChange={handleCustomerNameChange}
                placeholder="ระบุชื่อลูกค้า"
                className="h-11"
              />
            </div>
          </div>

          <MemoizedQuotationItemInputs 
            items={formData.items}
            onChange={handleItemsChange}
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
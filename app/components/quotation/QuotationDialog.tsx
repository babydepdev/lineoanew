import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { QuotationItemInputs } from './QuotationItemInputs';
import { AccountSelect } from './AccountSelect';
import { SuccessAlert } from './SuccessAlert';

interface CreateQuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateQuotationDialog({ 
  isOpen, 
  onClose,
  onSuccess 
}: CreateQuotationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
      
      setShowSuccess(true);
      setFormData({
        lineAccountId: '',
        customerName: '',
        items: [{ name: '', quantity: 1, price: 0 }]
      });
      
      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      console.error('Error creating quotation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>สร้างใบเสนอราคา</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Button type="button" variant="outline" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'กำลังสร้าง...' : 'สร้างใบเสนอราคา'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SuccessAlert
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="สร้างใบเสนอราคาสำเร็จ"
        description="ใบเสนอราคาถูกสร้างเรียบร้อยแล้ว"
      />
    </>
  );
}
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { QuotationItemInputs } from './QuotationItemInputs';
import { Quotation, QuotationFormData, QuotationFormItem } from '@/app/types/quotation';
import { SuccessAlert } from './SuccessAlert';

interface EditQuotationDialogProps {
  quotation: Quotation;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditQuotationDialog({ 
  quotation, 
  isOpen, 
  onClose,
  onUpdate 
}: EditQuotationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<QuotationFormData>({
    customerName: quotation.customerName,
    items: quotation.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quotations/${quotation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update quotation');
      
      onUpdate();
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating quotation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>แก้ไขใบเสนอราคา #{quotation.number}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>ชื่อลูกค้า</Label>
              <Input
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="ระบุชื่อลูกค้า"
              />
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
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SuccessAlert
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="แก้ไขใบเสนอราคาสำเร็จ"
        description="ใบเสนอราคาถูกแก้ไขเรียบร้อยแล้ว"
      />
    </>
  );
}
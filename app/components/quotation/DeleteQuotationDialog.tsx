import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Quotation } from '@/app/types/quotation';

interface DeleteQuotationDialogProps {
  quotation: Quotation;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteQuotationDialog({
  quotation,
  isOpen,
  onClose,
  onDelete
}: DeleteQuotationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/quotations/${quotation.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete quotation');
      
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting quotation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ลบใบเสนอราคา</DialogTitle>
          <DialogDescription>
            คุณต้องการลบใบเสนอราคาเลขที่ #{quotation.number} ใช่หรือไม่?
            การดำเนินการนี้ไม่สามารถยกเลิกได้
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'กำลังลบ...' : 'ลบ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
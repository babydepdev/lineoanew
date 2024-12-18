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
import { toast } from 'sonner';

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
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/quotations/${quotation.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete quotation');
      }

      onDelete();
      toast.success('ลบใบเสนอราคาสำเร็จ', {
        description: 'ใบเสนอราคาถูกลบเรียบร้อยแล้ว'
      });
      onClose();
    } catch (error) {
      console.error('Error deleting quotation:', error);
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถลบใบเสนอราคาได้'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ลบใบเสนอราคา</DialogTitle>
          <DialogDescription>
            คุณต้องการลบใบเสนอราคาเลขที่ #{quotation.number} ใช่หรือไม่?
            การดำเนินการนี้ไม่สามารถยกเลิกได้
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            ยกเลิก
          </Button>
          <Button
            type="button"
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
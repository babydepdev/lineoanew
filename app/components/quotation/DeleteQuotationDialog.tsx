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
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

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
      onClose();
    } catch (err) {
      console.error('Error deleting quotation:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete quotation');
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

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

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
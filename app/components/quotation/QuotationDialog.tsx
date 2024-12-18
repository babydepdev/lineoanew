import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { QuotationList } from './QuotationList';

interface QuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuotationDialog({ isOpen, onClose }: QuotationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>ใบเสนอราคา</DialogTitle>
        </DialogHeader>
        <QuotationList />
      </DialogContent>
    </Dialog>
  );
}
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { QuotationList } from './QuotationList';
import { Button } from '../ui/button';
import { CreateQuotationDialog } from './CreateQuotationDialog';
import { useState } from 'react';

interface QuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuotationDialog({ isOpen, onClose }: QuotationDialogProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>ใบเสนอราคา</DialogTitle>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              สร้างใบเสนอราคา
            </Button>
          </DialogHeader>
          <QuotationList />
        </DialogContent>
      </Dialog>

      <CreateQuotationDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
  );
}
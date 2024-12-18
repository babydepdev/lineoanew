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
        <DialogContent className="max-w-4xl h-[calc(100vh-64px)] sm:h-auto flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between flex-shrink-0">
            <DialogTitle>ใบเสนอราคา</DialogTitle>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">สร้างใบเสนอราคา</span>
              <span className="sm:hidden">สร้าง</span>
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <QuotationList />
          </div>
        </DialogContent>
      </Dialog>

      <CreateQuotationDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
  );
}
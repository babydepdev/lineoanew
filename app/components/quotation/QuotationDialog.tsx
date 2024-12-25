import { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { QuotationList } from './QuotationList';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { CreateQuotationDialog } from './CreateQuotationDialog';
import { useState } from 'react';

interface QuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuotationDialog({ isOpen, onClose }: QuotationDialogProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateSuccess = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-[1000px] flex flex-col h-[90vh] sm:h-[85vh] md:h-[80vh]">
          <DialogHeader className="flex flex-row items-center justify-between flex-shrink-0 px-4 sm:px-6">
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
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
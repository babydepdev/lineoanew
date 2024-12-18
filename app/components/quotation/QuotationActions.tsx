import { useState } from 'react';
import { MoreHorizontal, FileText, Printer, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ViewQuotationDialog } from './ViewQuotationDialog';
import { EditQuotationDialog } from './EditQuotationDialog';
import { DeleteQuotationDialog } from './DeleteQuotationDialog';
import { Quotation } from '@/app/types/quotation';

interface QuotationActionsProps {
  quotation: Quotation;
  onUpdate: () => void;
}

export function QuotationActions({ quotation, onUpdate }: QuotationActionsProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handlePrint = () => {
    // TODO: Implement print functionality
    console.log('Print quotation:', quotation.id);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewOpen(true)}>
          <FileText className="h-4 w-4 text-slate-500" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePrint}>
          <Printer className="h-4 w-4 text-slate-500" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              แก้ไข
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDeleteOpen(true)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              ลบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ViewQuotationDialog
        quotation={quotation}
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
      />

      <EditQuotationDialog
        quotation={quotation}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={onUpdate}
      />

      <DeleteQuotationDialog
        quotation={quotation}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={onUpdate}
      />
    </>
  );
}
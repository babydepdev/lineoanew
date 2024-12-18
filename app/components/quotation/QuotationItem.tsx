import { Quotation } from '@/app/types/quotation';
import { formatTimestamp } from '@/app/utils/dateFormatter';
import { Button } from '../ui/button';
import { FileText, Printer, MoreHorizontal } from 'lucide-react';

interface QuotationItemProps {
  quotation: Quotation;
}

export function QuotationItem({ quotation }: QuotationItemProps) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-slate-900">{quotation.customerName}</h4>
            <span className="text-sm text-slate-500">#{quotation.number}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {quotation.items.length} รายการ • ฿{quotation.total.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            {formatTimestamp(quotation.createdAt)}
          </span>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <FileText className="h-4 w-4 text-slate-500" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Printer className="h-4 w-4 text-slate-500" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
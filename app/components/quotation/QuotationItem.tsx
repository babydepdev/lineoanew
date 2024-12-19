import { Quotation } from '@/app/types/quotation';
import { formatThaiDateTime } from '@/lib/utils/dateFormatter';
import { QuotationActions } from './QuotationActions';

interface QuotationItemProps {
  quotation: Quotation;
  onUpdate?: () => void;
}

export function QuotationItem({ quotation, onUpdate }: QuotationItemProps) {
  return (
    <div className="p-4 bg-white rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-slate-900">{quotation.customerName}</h4>
            <span className="text-slate-500">#{quotation.number}</span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {quotation.items.length} รายการ • ฿{quotation.total.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 whitespace-nowrap">
            {formatThaiDateTime(quotation.createdAt)}
          </span>
          
          <QuotationActions 
            quotation={quotation} 
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </div>
  );
}
import { Quotation } from '@/app/types/quotation';
import { formatTimestamp } from '@/app/utils/dateFormatter';

interface QuotationItemProps {
  quotation: Quotation;
}

export function QuotationItem({ quotation }: QuotationItemProps) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-slate-900">{quotation.customerName}</h4>
          <p className="text-sm text-slate-500 mt-1">
            {quotation.items.length} รายการ • ฿{quotation.total.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">
            {formatTimestamp(quotation.createdAt)}
          </p>
          <p className="text-sm font-medium text-slate-700 mt-1">
            #{quotation.number}
          </p>
        </div>
      </div>
    </div>
  );
}
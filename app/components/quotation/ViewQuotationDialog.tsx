import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import { Quotation } from '@/app/types/quotation';
import { formatTimestamp } from '@/app/utils/dateFormatter';

interface ViewQuotationDialogProps {
  quotation: Quotation;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewQuotationDialog({ quotation, isOpen, onClose }: ViewQuotationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>ใบเสนอราคา #{quotation.number}</DialogTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            พิมพ์
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <span className="text-slate-500">ลูกค้า</span>
              <p className="mt-1 font-medium">{quotation.customerName}</p>
            </div>
            <div>
              <span className="text-slate-500">วันที่</span>
              <p className="mt-1 font-medium">{formatTimestamp(quotation.createdAt)}</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">รายการ</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">จำนวน</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">ราคาต่อหน่วย</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">รวม</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">฿{item.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">฿{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium bg-slate-50">ยอดรวมทั้งหมด</td>
                  <td className="px-4 py-3 text-right font-medium">฿{quotation.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
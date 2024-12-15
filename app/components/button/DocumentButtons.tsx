import { FileText, FileSpreadsheet } from 'lucide-react';
import { ResponsiveDocumentButton } from './ResponsiveDocumentButton';

export function DocumentButtons() {
  const handleQuotation = () => {
    // TODO: Implement quotation functionality
    console.log('Create quotation');
  };

  const handleInvoice = () => {
    // TODO: Implement invoice functionality
    console.log('Create invoice');
  };

  return (
    <div className="flex items-center gap-2">
      <ResponsiveDocumentButton
        onClick={handleQuotation}
        title="ใบเสนอราคา"
        icon={<FileText className="w-4 h-4" />}
      />
      
      <ResponsiveDocumentButton
        onClick={handleInvoice}
        variant="secondary"
        title="ใบเรียกเก็บเงิน"
        icon={<FileSpreadsheet className="w-4 h-4" />}
      />
    </div>
  );
}
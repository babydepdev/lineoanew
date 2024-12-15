
import { FileText, FileSpreadsheet } from 'lucide-react';
import { DocumentButton } from './DocumentButton';

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
      {/* Desktop buttons */}
      <div className="hidden sm:flex items-center gap-2">
        <DocumentButton onClick={handleQuotation} className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>ใบเสนอราคา</span>
        </DocumentButton>
        
        <DocumentButton 
          onClick={handleInvoice} 
          variant="secondary"
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ใบเรียกเก็บเงิน</span>
        </DocumentButton>
      </div>

      {/* Mobile buttons */}
      <div className="flex sm:hidden items-center gap-2">
        <DocumentButton 
          onClick={handleQuotation} 
          className="!p-2"
          title="ใบเสนอราคา"
        >
          <FileText className="w-4 h-4" />
        </DocumentButton>
        
        <DocumentButton 
          onClick={handleInvoice} 
          variant="secondary"
          className="!p-2"
          title="ใบเรียกเก็บเงิน"
        >
          <FileSpreadsheet className="w-4 h-4" />
        </DocumentButton>
      </div>
    </div>
  );
}
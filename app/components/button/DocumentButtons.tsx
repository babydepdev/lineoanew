
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
      <DocumentButton onClick={handleQuotation} className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Quotation</span>
      </DocumentButton>
      
      <DocumentButton 
        onClick={handleInvoice} 
        variant="secondary"
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span className="hidden sm:inline">Invoices</span>
      </DocumentButton>
    </div>
  );
}

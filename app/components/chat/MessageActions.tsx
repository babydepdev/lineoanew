import { FileText, FileSpreadsheet } from 'lucide-react';
import { Message } from '@prisma/client';
import { DocumentButton } from '../button/DocumentButton';

interface MessageActionsProps {
  message: Message;
}

export function MessageActions({ message }: MessageActionsProps) {
  const handleQuotation = () => {
    // TODO: Implement quotation functionality
    console.log('Create quotation for message:', message.id);
  };

  const handleInvoice = () => {
    // TODO: Implement invoice functionality
    console.log('Create invoice for message:', message.id);
  };

  // Only show actions for user messages
  if (message.sender !== 'USER') {
    return null;
  }

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
      {/* Desktop buttons */}
      <div className="hidden lg:flex items-center gap-2 absolute -right-[280px]">
        <DocumentButton 
          onClick={handleQuotation}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <FileText className="w-4 h-4" />
          <span>ใบเสนอราคา</span>
        </DocumentButton>
        
        <DocumentButton 
          onClick={handleInvoice}
          variant="secondary"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ใบเรียกเก็บเงิน</span>
        </DocumentButton>
      </div>

      {/* Mobile buttons */}
      <div className="flex lg:hidden items-center gap-2 px-2">
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
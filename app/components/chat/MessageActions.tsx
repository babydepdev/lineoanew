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
    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-[140px] top-1/2 -translate-y-1/2 flex items-center gap-1">
      <DocumentButton 
        onClick={handleQuotation}
        className="!px-2 !py-1.5 flex items-center gap-1"
      >
        <FileText className="w-3 h-3" />
        <span className="text-xs">ใบเสนอราคา</span>
      </DocumentButton>
      
      <DocumentButton 
        onClick={handleInvoice}
        variant="secondary"
        className="!px-2 !py-1.5 flex items-center gap-1"
      >
        <FileSpreadsheet className="w-3 h-3" />
        <span className="text-xs">ใบเรียกเก็บเงิน</span>
      </DocumentButton>
    </div>
  );
}
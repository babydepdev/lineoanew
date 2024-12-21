import { FileText, FileSpreadsheet } from 'lucide-react';
import { Message } from '@prisma/client';
import { ResponsiveDocumentButton } from '../button/ResponsiveDocumentButton';
import { cn } from '@/lib/utils';

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
    <div className={cn(
      "opacity-0 group-hover:opacity-100 transition-opacity",
      "absolute top-1/2 -translate-y-1/2",
      "flex items-center gap-2",
      "right-2 sm:right-4 lg:right-8"
    )}>
      <ResponsiveDocumentButton
        onClick={handleQuotation}
        title="ใบเสนอราคา"
        icon={<FileText className="w-4 h-4" />}
      />
      
      <ResponsiveDocumentButton
        onClick={handleInvoice}
        variant="secondary"
        title="Invoices"
        icon={<FileSpreadsheet className="w-4 h-4" />}
      />
    </div>
  );
}
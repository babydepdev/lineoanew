import { MessageCircle, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  onClose: () => void;
  conversationCount: number;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="flex-none p-4 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">All in one Chat</h2>
          
          </div>
        </div>
        
        <button
          onClick={onClose}
          className={cn(
            "lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors",
            "text-slate-600 hover:text-slate-900"
          )}
          aria-label="Close sidebar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
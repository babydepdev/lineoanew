import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ConversationListHeaderProps {
  filteredCount: number;
  totalCount: number;
}

export function ConversationListHeader({
  filteredCount,
  totalCount
}: ConversationListHeaderProps) {
  const displayCount = filteredCount !== totalCount ? `${filteredCount}/${totalCount}` : totalCount;
  
  return (
    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Conversations</h2>
          <p className="text-sm text-slate-500 mt-1">
            {displayCount} {displayCount === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>
      </div>
    </div>
  );
}
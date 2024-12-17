import React from 'react';

interface EmptyStateProps {
  selectedAccountId: string | null;
}

export function EmptyState({ selectedAccountId }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50">
      <div className="p-8 text-center">
        <p className="text-sm font-medium text-slate-900">No conversations yet</p>
        <p className="mt-1 text-sm text-slate-500">
          {selectedAccountId 
            ? "No chats found for this LINE account"
            : "Start chatting to see your conversations here"
          }
        </p>
      </div>
    </div>
  );
}
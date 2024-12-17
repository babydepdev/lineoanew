import React from 'react';
import { ConversationWithMessages } from '@/app/types/chat';
import { useConversationFiltering } from '@/app/hooks/useConversationFiltering';
import { ConversationListHeader } from './ConversationListHeader';
import { ConversationListContent } from './ConversationListContent';

interface ConversationListContainerProps {
  conversations: ConversationWithMessages[];
  onSelect: (conversation: ConversationWithMessages) => void;
  selectedId?: string;
}

export function ConversationListContainer({
  conversations,
  onSelect,
  selectedId
}: ConversationListContainerProps) {
  const {
    selectedAccountId,
    setSelectedAccountId,
    filteredConversations,
    totalCount
  } = useConversationFiltering(conversations);

  return (
    <div className="flex flex-col h-full">
      <ConversationListHeader 
        totalCount={totalCount}
        selectedAccountId={selectedAccountId}
        onAccountSelect={setSelectedAccountId}
      />
      <ConversationListContent
        conversations={filteredConversations}
        selectedId={selectedId}
        onSelect={onSelect}
        selectedAccountId={selectedAccountId}
      />
    </div>
  );
}
import React from 'react';
import { ConversationWithMessages } from '@/app/types/chat';
import { useConversationState } from '@/app/hooks/conversation/useConversationState';
import { ConversationListHeader } from './ConversationListHeader';
import { ConversationListContent } from './ConversationListContent';
import { LineAccountTabs } from '../line-account/LineAccountTabs';

interface ConversationListContainerProps {
  conversations: ConversationWithMessages[];
  onSelect: (conversation: ConversationWithMessages) => void;
  selectedId?: string;
}

export function ConversationListContainer({
  conversations: initialConversations,
  onSelect,
  selectedId
}: ConversationListContainerProps) {
  const {
    conversations,
    selectedAccountId,
    setSelectedAccountId,
    filteredCount,
    totalCount,
    updateConversations
  } = useConversationState(initialConversations);

  // Update conversations when initial data changes
  React.useEffect(() => {
    updateConversations(initialConversations);
  }, [initialConversations, updateConversations]);

  return (
    <div className="flex flex-col h-full">
      <ConversationListHeader 
        filteredCount={filteredCount}
        totalCount={totalCount}
      />
      <LineAccountTabs 
        selectedAccountId={selectedAccountId}
        onAccountSelect={setSelectedAccountId}
      />
      <ConversationListContent
        conversations={conversations}
        selectedId={selectedId}
        onSelect={onSelect}
        selectedAccountId={selectedAccountId}
      />
    </div>
  );
}
import { useState, useCallback } from 'react';
import { ConversationWithMessages } from '@/app/types/chat';
import { useConversationFilter } from './useConversationFilter';
import { useConversationSort } from './useConversationSort';

export function useConversationState(initialConversations: ConversationWithMessages[]) {
  const [conversations, setConversations] = useState<ConversationWithMessages[]>(initialConversations);
  const { filterConversations, selectedAccountId, setSelectedAccountId, getConversationCounts } = useConversationFilter();
  const { sortConversations } = useConversationSort();

  const processConversations = useCallback(() => {
    const filtered = filterConversations(conversations);
    const sorted = sortConversations(filtered);
    return sorted;
  }, [conversations, filterConversations, sortConversations]);

  const updateConversations = useCallback((newConversations: ConversationWithMessages[]) => {
    setConversations(newConversations);
  }, []);

  return {
    conversations: processConversations(),
    rawConversations: conversations,
    selectedAccountId,
    setSelectedAccountId,
    updateConversations,
    ...getConversationCounts(conversations)
  };
}
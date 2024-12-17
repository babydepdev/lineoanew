import { useState, useCallback } from 'react';
import { ConversationWithMessages } from '@/app/types/chat';

export function useConversationFilter() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const filterConversations = useCallback((conversations: ConversationWithMessages[]) => {
    if (!selectedAccountId) return conversations;

    return conversations.filter(conv => 
      conv.platform === 'LINE' && conv.lineAccountId === selectedAccountId
    );
  }, [selectedAccountId]);

  const getConversationCounts = useCallback((conversations: ConversationWithMessages[]) => {
    const filtered = filterConversations(conversations);
    return {
      filteredCount: filtered.length,
      totalCount: conversations.length
    };
  }, [filterConversations]);

  return {
    selectedAccountId,
    setSelectedAccountId,
    filterConversations,
    getConversationCounts
  };
}
import { useState, useMemo } from 'react';
import { ConversationWithMessages } from '../types/chat';

interface UseConversationFilteringResult {
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  filteredConversations: ConversationWithMessages[];
  filteredCount: number;
  totalCount: number;
}

export function useConversationFiltering(
  conversations: ConversationWithMessages[]
): UseConversationFilteringResult {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const filteredConversations = useMemo(() => {
    if (!selectedAccountId) return conversations;
    
    return conversations.filter(conv => 
      conv.platform === 'LINE' && conv.lineAccountId === selectedAccountId
    );
  }, [conversations, selectedAccountId]);

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [filteredConversations]);

  return {
    selectedAccountId,
    setSelectedAccountId,
    filteredConversations: sortedConversations,
    filteredCount: filteredConversations.length,
    totalCount: conversations.length
  };
}
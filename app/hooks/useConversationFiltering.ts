import { useState, useMemo, useEffect } from 'react';
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

  // Reset selected account if it no longer exists in conversations
  useEffect(() => {
    if (selectedAccountId) {
      const accountExists = conversations.some(conv => 
        conv.platform === 'LINE' && conv.lineAccountId === selectedAccountId
      );
      if (!accountExists) {
        setSelectedAccountId(null);
      }
    }
  }, [conversations, selectedAccountId]);

  const filteredConversations = useMemo(() => {
    if (!selectedAccountId) return conversations;
    
    return conversations.filter(conv => {
      // Only filter LINE conversations by account
      if (conv.platform !== 'LINE') return false;
      
      // Include conversations with matching lineAccountId
      return conv.lineAccountId === selectedAccountId;
    });
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
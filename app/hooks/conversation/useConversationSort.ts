import { useCallback } from 'react';
import { ConversationWithMessages } from '@/app/types/chat';

export function useConversationSort() {
  const sortConversations = useCallback((conversations: ConversationWithMessages[]) => {
    return [...conversations].sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, []);

  return { sortConversations };
}
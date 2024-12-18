import { useCallback } from 'react';
import { ConversationWithMessages } from '@/app/types/chat';

export function useConversationSort() {
  const sortConversations = useCallback((conversations: ConversationWithMessages[]) => {
    return [...conversations].sort((a, b) => {
      // Get latest message timestamp for each conversation
      const aLatestMessage = a.messages.length > 0 ? 
        a.messages[a.messages.length - 1].timestamp : 
        a.updatedAt;
      
      const bLatestMessage = b.messages.length > 0 ? 
        b.messages[b.messages.length - 1].timestamp : 
        b.updatedAt;

      // Sort by latest message timestamp
      return bLatestMessage.getTime() - aLatestMessage.getTime();
    });
  }, []);

  return { sortConversations };
}
import { ConversationWithMessages } from '@/app/types/chat';
import { useChatState } from './useChatState';
import { useChatEvents } from './useChatEvents';
import { useChatActions } from './useChatActions';

export function useChat(initialConversations: ConversationWithMessages[]) {
  const { conversations, selectedConversation, setSelectedConversation } = useChatState();
  const { sendMessage } = useChatActions();
  
  useChatEvents(initialConversations);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  };
}
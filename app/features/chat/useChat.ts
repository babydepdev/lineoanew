import { SerializedConversation } from '@/app/types/chat';
import { useChatState } from './useChatState';
import { useConversationEvents } from '@/app/hooks/useConversationEvents';
import { usePusherEvents } from '@/app/hooks/usePusherEvents';
import { useChatActions } from './useChatActions';

export function useChat(initialConversations: SerializedConversation[]) {
  const { conversations, selectedConversation, setSelectedConversation } = useChatState();
  const { sendMessage } = useChatActions();
  
  useConversationEvents(initialConversations);
  usePusherEvents();

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  };
}
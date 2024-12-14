import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages } from '../types/chat';
import { useChatState } from '../features/chat/useChatState';

export function useConversationEvents(initialConversations: SerializedConversation[]) {
  const { setConversations } = useChatState();

  useEffect(() => {
    if (!Array.isArray(initialConversations)) {
      console.warn('Invalid conversations data:', initialConversations);
      return;
    }

    console.log('Processing initial conversations:', initialConversations.length);

    const formattedConversations = initialConversations.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        metadata: msg.metadata || null
      })),
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt)
    })) as ConversationWithMessages[];

    setConversations(formattedConversations);
  }, [initialConversations, setConversations]);
}
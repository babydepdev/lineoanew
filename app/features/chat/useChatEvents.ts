import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages } from '@/app/types/chat';
import { useChatState } from './useChatState';

export function useChatEvents(initialConversations: SerializedConversation[]) {
  const { setConversations } = useChatState();

  useEffect(() => {
    if (!Array.isArray(initialConversations)) return;

    try {
      const formattedConversations = initialConversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        lineChannel: conv.lineChannel ? {
          ...conv.lineChannel,
          createdAt: new Date(conv.lineChannel.createdAt),
          updatedAt: new Date(conv.lineChannel.updatedAt)
        } : null
      })) as ConversationWithMessages[];

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error formatting conversations:', error);
      setConversations([]);
    }
  }, [initialConversations, setConversations]);
}
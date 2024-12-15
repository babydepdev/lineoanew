
import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages } from '../types/chat';
import { useChatState } from '../features/chat/useChatState';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';

export function useConversationEvents(initialConversations: SerializedConversation[]) {
  const { setConversations, updateConversation } = useChatState();

  // Initialize conversations
  useEffect(() => {
    if (!Array.isArray(initialConversations)) return;

    const formattedConversations = initialConversations.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })),
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt)
    })) as ConversationWithMessages[];

    setConversations(formattedConversations);
  }, [initialConversations, setConversations]);

  // Subscribe to Pusher events
  useEffect(() => {
    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleConversationsUpdated = (conversations: SerializedConversation[]) => {
      const formattedConversations = conversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      })) as ConversationWithMessages[];

      setConversations(formattedConversations);
    };

    const handleConversationUpdated = (conversation: SerializedConversation) => {
      const formattedConversation = {
        ...conversation,
        messages: conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt)
      } as ConversationWithMessages;

      updateConversation(formattedConversation);
    };

    channel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);
    channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);

    return () => {
      channel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);
      channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [setConversations, updateConversation]);
}

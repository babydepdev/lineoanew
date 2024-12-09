import { useEffect } from 'react';
import { PusherMessage, PusherConversation } from '../types/chat';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useChatState } from '../features/chat/useChatState';

export function usePusherEvents() {
  const {
    selectedConversation,
    setConversations,
    setSelectedConversation,
    updateConversation,
    addMessage,
  } = useChatState();

  useEffect(() => {
    const mainChannel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleMessageReceived = (message: PusherMessage) => {
      if (!message?.id || !message?.conversationId) return;
      
      addMessage({
        ...message,
        timestamp: new Date(message.timestamp)
      });
    };

    const handleConversationUpdated = (conversation: PusherConversation) => {
      if (!conversation?.id) return;

      const updatedConversation = {
        ...conversation,
        messages: conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt)
      };

      updateConversation(updatedConversation);

      if (selectedConversation?.id === conversation.id) {
        setSelectedConversation(updatedConversation);
      }
    };

    const handleConversationsUpdated = (conversations: PusherConversation[]) => {
      setConversations(conversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      })));
    };

    mainChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
    mainChannel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
    mainChannel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);

    return () => {
      mainChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
      mainChannel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      mainChannel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [selectedConversation?.id, addMessage, updateConversation, setSelectedConversation, setConversations]);
}
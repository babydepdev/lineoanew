import { useEffect } from 'react';
import { SerializedConversation, ConversationWithMessages, PusherMessage, PusherConversation } from '@/app/types/chat';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useChatState } from './useChatState';

export function useChatEvents(initialConversations: SerializedConversation[]) {
  const {
    selectedConversation,
    setConversations,
    setSelectedConversation,
    updateConversation,
    addMessage,
  } = useChatState();

  // Initialize conversations
  useEffect(() => {
    if (Array.isArray(initialConversations)) {
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
    }
  }, [initialConversations, setConversations]);

  // Setup Pusher event handlers
  useEffect(() => {
    const mainChannel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleMessageReceived = (message: PusherMessage) => {
      if (!message?.id || !message?.conversationId) return;
      
      const updatedMessage = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      
      addMessage(updatedMessage);
    };

    const handleConversationUpdated = (pusherConversation: PusherConversation) => {
      if (!pusherConversation?.id) return;

      const updatedConversation = {
        ...pusherConversation,
        messages: pusherConversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(pusherConversation.createdAt),
        updatedAt: new Date(pusherConversation.updatedAt)
      } as ConversationWithMessages;

      updateConversation(updatedConversation);

      if (selectedConversation?.id === pusherConversation.id) {
        setSelectedConversation(updatedConversation);
      }
    };

    const handleConversationsUpdated = (conversations: PusherConversation[]) => {
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

    // Subscribe to events
    mainChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
    mainChannel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
    mainChannel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);

    // Cleanup
    return () => {
      mainChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
      mainChannel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      mainChannel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [selectedConversation, addMessage, updateConversation, setSelectedConversation, setConversations]);
}
"use client";

import { useEffect } from 'react';

import { PusherMessage, PusherConversation } from '../types/chat';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useChatState } from '../features/chat/useChatState';
import { mapApiMessageToMessage } from '@/lib/utils/messageMapper';

export function usePusherEvents() {
  const {
    selectedConversation,
    setConversations,
    setSelectedConversation,
    updateConversation,
    addMessage,
  } = useChatState();

  useEffect(() => {
    try {
      const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

      const handleMessageReceived = (message: PusherMessage) => {
        if (!message?.id || !message?.conversationId) {
          console.warn('Received invalid message:', message);
          return;
        }
        
        const processedMessage = mapApiMessageToMessage(message);
        addMessage(processedMessage);
      };

      const handleConversationUpdated = (conversation: PusherConversation) => {
        if (!conversation?.id) {
          console.warn('Received invalid conversation:', conversation);
          return;
        }

        const processedMessages = conversation.messages.map(mapApiMessageToMessage);

        const updatedConversation = {
          ...conversation,
          messages: processedMessages,
          createdAt: new Date(conversation.createdAt),
          updatedAt: new Date(conversation.updatedAt),
          lineAccountId: conversation.lineAccountId || null
        };

        updateConversation(updatedConversation);

        if (selectedConversation?.id === conversation.id) {
          setSelectedConversation(updatedConversation);
        }
      };

      const handleConversationsUpdated = (conversations: PusherConversation[]) => {
        if (!Array.isArray(conversations)) {
          console.warn('Received invalid conversations:', conversations);
          return;
        }

        const processedConversations = conversations.map(conv => ({
          ...conv,
          messages: conv.messages.map(mapApiMessageToMessage),
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          lineAccountId: conv.lineAccountId || null
        }));

        setConversations(processedConversations);
      };

      // Subscribe to events
      channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
      channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      channel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);

      return () => {
        channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
        channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
        channel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);
        pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
      };
    } catch (error) {
      console.error('Error setting up Pusher events:', error);
    }
  }, [selectedConversation?.id, addMessage, updateConversation, setSelectedConversation, setConversations]);
}
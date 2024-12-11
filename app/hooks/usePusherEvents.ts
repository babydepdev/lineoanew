"use client";

import { useEffect } from 'react';
import { Message, Platform, SenderType } from '@prisma/client';
import { PusherMessage, PusherConversation } from '../types/chat';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useChatState } from '../features/chat/useChatState';
import { deserializeConversation } from '../utils/serializers';

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
        
        const processedMessage: Message = {
          id: message.id,
          conversationId: message.conversationId,
          content: message.content,
          sender: message.sender as SenderType,
          timestamp: new Date(message.timestamp),
          platform: message.platform as Platform,
          externalId: message.externalId
        };

        addMessage(processedMessage);
      };

      const handleConversationUpdated = (conversation: PusherConversation) => {
        if (!conversation?.id) {
          console.warn('Received invalid conversation:', conversation);
          return;
        }

        const processedConversation = deserializeConversation(conversation);
        updateConversation(processedConversation);

        if (selectedConversation?.id === conversation.id) {
          setSelectedConversation(processedConversation);
        }
      };

      const handleConversationsUpdated = (conversations: PusherConversation[]) => {
        if (!Array.isArray(conversations)) {
          console.warn('Received invalid conversations:', conversations);
          return;
        }

        const processedConversations = conversations.map(deserializeConversation);
        setConversations(processedConversations);
      };

      // Subscribe to events
      channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
      channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      channel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);

      // Cleanup
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
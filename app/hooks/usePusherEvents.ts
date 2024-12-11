import { useEffect } from 'react';
import {  Platform } from '@prisma/client';
import { PusherMessage, PusherConversation } from '@/app/types/pusher';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useChatState } from '../features/chat/useChatState';
import { mapApiMessageToMessage } from '@/app/utils/messageMapper';

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

        const updatedConversation = {
          id: conversation.id,
          platform: conversation.platform as Platform,
          channelId: conversation.channelId,
          userId: conversation.userId,
          messages: conversation.messages.map(mapApiMessageToMessage),
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
          id: conv.id,
          platform: conv.platform as Platform,
          channelId: conv.channelId,
          userId: conv.userId,
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
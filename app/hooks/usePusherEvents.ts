"use client";

import { useEffect } from 'react';
import { Message, Platform, SenderType } from '@prisma/client';
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
          timestamp: new Date(),
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

        const processedMessages = conversation.messages.map(msg => ({
          id: msg.id,
          conversationId: msg.conversationId,
          content: msg.content,
          sender: msg.sender as SenderType,
          timestamp: new Date(msg.timestamp),
          platform: msg.platform as Platform,
          externalId: msg.externalId
        }));

        const updatedConversation = {
          id: conversation.id,
          platform: conversation.platform as Platform,
          channelId: conversation.channelId,
          userId: conversation.userId,
          messages: processedMessages,
          createdAt: new Date(conversation.createdAt),
          updatedAt: new Date(conversation.updatedAt)
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
          messages: conv.messages.map(msg => ({
            id: msg.id,
            conversationId: msg.conversationId,
            content: msg.content,
            sender: msg.sender as SenderType,
            timestamp: new Date(msg.timestamp),
            platform: msg.platform as Platform,
            externalId: msg.externalId
          })),
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt)
        }));

        setConversations(processedConversations);
      };

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
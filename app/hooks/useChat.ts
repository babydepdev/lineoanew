import { useCallback, useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { ConversationWithMessages } from '../types/chat';
import { useConversationStore } from '../store/useConversationStore';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import type { PusherMessage, PusherConversation } from '@/lib/messageFormatter';

export function useChat(initialConversations: ConversationWithMessages[]) {
  const {
    conversations,
    selectedConversation,
    setConversations,
    setSelectedConversation,
    updateConversation,
    addMessage,
  } = useConversationStore();

  const messageQueue = useRef<Set<string>>(new Set());
  const processingMessage = useRef<boolean>(false);

  const handleMessageReceived = useCallback(async (pusherMessage: PusherMessage) => {
    console.log('Received message:', pusherMessage);
    
    if (processingMessage.current) {
      console.log('Message processing in progress, queuing:', pusherMessage.id);
      return;
    }

    // Prevent duplicate messages
    if (messageQueue.current.has(pusherMessage.id)) {
      console.log('Duplicate message detected:', pusherMessage.id);
      return;
    }
    
    try {
      processingMessage.current = true;
      messageQueue.current.add(pusherMessage.id);
      
      const message: Message = {
        ...pusherMessage,
        timestamp: new Date(pusherMessage.timestamp),
      };
      
      // Immediately add the message to the store
      addMessage(message);
      
      // Remove message from queue after processing
      setTimeout(() => {
        messageQueue.current.delete(pusherMessage.id);
      }, 5000);
    } finally {
      processingMessage.current = false;
    }
  }, [addMessage]);

  const handleConversationUpdated = useCallback((pusherConversation: PusherConversation) => {
    console.log('Conversation updated:', pusherConversation);
    
    const conversation: ConversationWithMessages = {
      ...pusherConversation,
      messages: pusherConversation.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      createdAt: new Date(pusherConversation.createdAt),
      updatedAt: new Date(pusherConversation.updatedAt),
    };
    
    updateConversation(conversation);
  }, [updateConversation]);

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedConversation) return;

    try {
      const tempId = `temp-${Date.now()}`;
      
      // Optimistically add the message locally first
      const optimisticMessage: Message = {
        id: tempId,
        conversationId: selectedConversation.id,
        content,
        sender: 'BOT',
        platform: selectedConversation.platform,
        timestamp: new Date(),
        externalId: null,
      };

      messageQueue.current.add(tempId);
      addMessage(optimisticMessage);

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content,
          platform: selectedConversation.platform,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const updatedConversation = await response.json();
      updateConversation(updatedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [selectedConversation, updateConversation, addMessage]);

  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      setConversations(initialConversations);
      if (initialConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(initialConversations[0]);
      }
    }
  }, [initialConversations, setConversations, setSelectedConversation, selectedConversation]);

  useEffect(() => {
    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);
    
    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
    channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
      channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [handleMessageReceived, handleConversationUpdated]);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  };
}
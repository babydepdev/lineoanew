import { useCallback, useEffect, useRef } from 'react';
import type { ConversationWithMessages } from '../types/chat';
import { useConversationStore } from '../store/useConversationStore';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import type { PusherMessage, PusherConversation } from '../types/chat';

export function useChat(initialConversations: ConversationWithMessages[]) {
  const {
    conversations,
    selectedConversation,
    setConversations,
    setSelectedConversation,
    updateConversation,
    addMessage,
  } = useConversationStore();

  const messageQueueRef = useRef<Set<string>>(new Set());
  const processingRef = useRef(false);

  const processMessageQueue = useCallback(async () => {
    if (processingRef.current || messageQueueRef.current.size === 0) return;

    processingRef.current = true;
    const messageIds = Array.from(messageQueueRef.current);
    messageQueueRef.current.clear();

    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const messages = await response.json();
      
      for (const message of messages) {
        if (messageIds.includes(message.id)) {
          addMessage(message);
        }
      }
    } catch (error) {
      console.error('Error processing message queue:', error);
    } finally {
      processingRef.current = false;
    }
  }, [addMessage]);

  const handleMessageReceived = useCallback((message: PusherMessage) => {
    if (!message?.id || !message?.conversationId) return;
    
    messageQueueRef.current.add(message.id);
    processMessageQueue();
  }, [processMessageQueue]);

  const handleConversationUpdated = useCallback((pusherConversation: PusherConversation) => {
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
  }, [selectedConversation, updateConversation, setSelectedConversation]);

  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      setConversations(initialConversations);
    }
  }, [initialConversations, setConversations]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);
    
    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
    channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
      channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [handleMessageReceived, handleConversationUpdated]);

  const sendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
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
      if (updatedConversation) {
        updateConversation(updatedConversation);
        setSelectedConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  };
}
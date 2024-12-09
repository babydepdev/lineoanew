import { useCallback, useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { ConversationWithMessages } from '../types/chat';
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
  } = useConversationStore();

  const messageQueue = useRef<Set<string>>(new Set());
  const processingMessage = useRef<boolean>(false);

  const processMessageQueue = useCallback(async () => {
    if (processingMessage.current || messageQueue.current.size === 0) return;

    processingMessage.current = true;
    const messageId = Array.from(messageQueue.current)[0];

    try {
      const response = await fetch(`/api/messages/${messageId}`);
      if (response.ok) {
        const message = await response.json();
        if (message) {
          const conversation = conversations.find(c => c.id === message.conversationId);
          if (conversation) {
            const updatedConversation = {
              ...conversation,
              messages: [...conversation.messages, message],
            };
            updateConversation(updatedConversation);
          }
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      messageQueue.current.delete(messageId);
      processingMessage.current = false;
      // Process next message if any
      if (messageQueue.current.size > 0) {
        processMessageQueue();
      }
    }
  }, [conversations, updateConversation]);

  const handleMessageReceived = useCallback((message: PusherMessage) => {
    if (!message?.id || !message?.conversationId) return;
    
    // Add message to queue if not already present
    if (!messageQueue.current.has(message.id)) {
      messageQueue.current.add(message.id);
      processMessageQueue();
    }
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
      messageQueue.current.clear();
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
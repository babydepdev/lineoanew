"use client";

import { useState, useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import { pusherClient, PUSHER_EVENTS} from '@/lib/pusher';

export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) return prev;
      
      const updated = [...prev, newMessage].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );
      return updated;
    });
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/line/${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        const allMessages = [...data.botMessages, ...data.userMessages]
          .map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        setMessages(allMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = pusherClient.subscribe(`private-conversation-${conversationId}`);
    
    const handleNewMessage = (message: any) => {
      if (message.conversationId === conversationId) {
        addMessage({
          ...message,
          timestamp: new Date(message.timestamp)
        });
      }
    };

    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, addMessage]);

  return { messages, isLoading };
}
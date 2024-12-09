"use client";

import { useState, useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import { pusherClient, PUSHER_EVENTS } from '@/lib/pusher';

interface UseRealtimeMessagesResult {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
}

export function useRealtimeMessages(conversationId: string): UseRealtimeMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Check if message already exists
      const exists = prev.some(msg => 
        msg.id === newMessage.id || 
        (msg.id.startsWith('temp-') && msg.content === newMessage.content)
      );
      
      if (exists) {
        // Replace temp message with real message
        return prev.map(msg => 
          (msg.id.startsWith('temp-') && msg.content === newMessage.content)
            ? { ...newMessage, sender: 'BOT' } // Ensure correct sender type
            : msg
        );
      }
      
      // Add new message and sort by timestamp
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
          timestamp: new Date(message.timestamp),
          sender: message.sender // Preserve the correct sender type
        });
      }
    };

    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, addMessage]);

  return { messages, isLoading, addMessage };
}
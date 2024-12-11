"use client";

import { useState, useEffect } from 'react';
import { Message } from '@prisma/client';
import { useMessageStore } from './useMessageStore';
import { SerializedMessage } from '../types/chat';

interface UseRealtimeMessagesResult {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
}

export function useRealtimeMessages(conversationId: string): UseRealtimeMessagesResult {
  const { messages, setMessages, addMessage } = useMessageStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/line/${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        const allMessages = [...data.botMessages, ...data.userMessages]
          .map((msg: SerializedMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            chatType: msg.chatType || null,
            chatId: msg.chatId || null
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
    const eventSource = new EventSource(`/api/messages/subscribe/${conversationId}`);
    
    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      addMessage({
        ...message,
        timestamp: new Date(message.timestamp),
        chatType: message.chatType || null,
        chatId: message.chatId || null
      });
    };

    return () => {
      eventSource.close();
    };
  }, [conversationId, setMessages, addMessage]);

  return { messages, isLoading, addMessage };
}
"use client";

import { useState, useEffect } from 'react';
import { Message } from '@prisma/client';
import { usePusherSubscription } from './usePusherSubscription';
import { useMessageStore } from './useMessageStore';
import { prefetchProfiles } from '@/lib/services/lineProfileService';

interface UseRealtimeMessagesResult {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
}

export function useRealtimeMessages(conversationId: string): UseRealtimeMessagesResult {
  const { messages, setMessages, addMessage } = useMessageStore();
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to Pusher channels
  usePusherSubscription(conversationId, addMessage);

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

        // Prefetch profiles for all LINE user messages
        const userIds = allMessages
          .filter(msg => msg.platform === 'LINE' && msg.sender === 'USER')
          .map(msg => msg.conversationId);

        if (userIds.length > 0) {
          await prefetchProfiles(userIds);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, setMessages]);

  return { messages, isLoading, addMessage };
}
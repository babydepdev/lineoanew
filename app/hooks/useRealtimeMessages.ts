import { useState, useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import { usePusherSubscription } from './usePusherSubscription';
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
  const [processedEvents] = useState(new Set<string>());

  const handleNewMessage = useCallback((message: Message & { eventId?: string }) => {
    // Skip if we've already processed this event
    if (message.eventId && processedEvents.has(message.eventId)) {
      return;
    }

    // Add event ID to processed set
    if (message.eventId) {
      processedEvents.add(message.eventId);
    }

    // Add message
    addMessage(message);

    // Clean up old event IDs (optional)
    if (processedEvents.size > 1000) {
      const oldestEvents = Array.from(processedEvents).slice(0, 500);
      oldestEvents.forEach(id => processedEvents.delete(id));
    }
  }, [addMessage, processedEvents]);

  // Subscribe to Pusher channels
  usePusherSubscription(conversationId, handleNewMessage);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/line/${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        const allMessages = [...data.botMessages, ...data.userMessages]
          .map((msg: SerializedMessage) => ({
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
  }, [conversationId, setMessages]);

  return { messages, isLoading, addMessage: handleNewMessage };
}

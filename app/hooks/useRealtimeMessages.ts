// app/hooks/useRealtimeMessages.ts
import { useState, useEffect } from 'react';
import { Message } from '@prisma/client';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';

export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial message fetch
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch(`/api/messages/line/${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        const sortedMessages = [...data.botMessages, ...data.userMessages]
          .map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [conversationId]);

  // Pusher subscription for real-time updates
  useEffect(() => {
    // Subscribe to both main channel and conversation-specific channel
    const mainChannel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);
    const conversationChannel = pusherClient.subscribe(
      `private-conversation-${conversationId}`
    );

    function handleNewMessage(message: any) {
      if (message.conversationId === conversationId) {
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => msg.id === message.id);
          if (exists) return prev;

          // Add new message and sort
          const newMessages = [...prev, {
            ...message,
            timestamp: new Date(message.timestamp)
          }];
          return newMessages.sort((a, b) => 
            a.timestamp.getTime() - b.timestamp.getTime()
          );
        });
      }
    }

    // Bind to message events
    mainChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    conversationChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    // Cleanup
    return () => {
      mainChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      conversationChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId]);

  const addMessage = (message: Message) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === message.id);
      if (exists) return prev;

      const newMessages = [...prev, message];
      return newMessages.sort((a, b) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      );
    });
  };

  return { messages, isLoading, addMessage };
}

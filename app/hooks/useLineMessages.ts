import { useState, useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';

interface UseLineMessagesResult {
  botMessages: Message[];
  userMessages: Message[];
  isLoading: boolean;
  error: Error | null;
}

export function useLineMessages(conversationId: string): UseLineMessagesResult {
  const [botMessages, setBotMessages] = useState<Message[]>([]);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleNewMessage = useCallback((message: Message) => {
    if (message.conversationId !== conversationId) return;
    
    const newMessage = {
      ...message,
      timestamp: new Date(message.timestamp)
    };

    if (message.sender === 'BOT') {
      setBotMessages(prev => [...prev, newMessage]);
    } else {
      setUserMessages(prev => [...prev, newMessage]);
    }
  }, [conversationId]);

  useEffect(() => {
    let mounted = true;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/line/${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        if (!mounted) return;

        setBotMessages(data.botMessages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        setUserMessages(data.userMessages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = pusherClient.subscribe(`${PUSHER_CHANNELS.CHAT}-${conversationId}`);
    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    
    // Subscribe to conversation-specific events
    pusherClient.subscribe(`private-conversation-${conversationId}`);

    return () => {
      mounted = false;
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(`${PUSHER_CHANNELS.CHAT}-${conversationId}`);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, handleNewMessage]);

  return { botMessages, userMessages, isLoading, error };
}
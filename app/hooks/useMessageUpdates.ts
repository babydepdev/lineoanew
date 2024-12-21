import { useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import { pusherClient } from '@/lib/pusher';
import { PUSHER_EVENTS, PUSHER_CHANNELS } from '@/app/config/constants';

export function useMessageUpdates(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  const handleNewMessage = useCallback((message: Message) => {
    if (message.conversationId === conversationId) {
      onNewMessage({
        ...message,
        timestamp: new Date(message.timestamp)
      });
    }
  }, [conversationId, onNewMessage]);

  useEffect(() => {
    // Subscribe to both main and conversation-specific channels
    const mainChannel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);
    const conversationChannel = pusherClient.subscribe(
      `private-conversation-${conversationId}`
    );

    // Bind message handlers
    mainChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    conversationChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      // Cleanup subscriptions
      mainChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      conversationChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, handleNewMessage]);
}
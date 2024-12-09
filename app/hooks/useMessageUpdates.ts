"use client";

import { useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import { pusherClient, PUSHER_EVENTS } from '@/lib/pusher';

export function useMessageUpdates(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  const handleNewMessage = useCallback(
    (message: any) => {
      if (message.conversationId === conversationId) {
        onNewMessage({
          ...message,
          timestamp: new Date(message.timestamp)
        });
      }
    },
    [conversationId, onNewMessage]
  );

  useEffect(() => {
    // Subscribe to conversation-specific channel
    const conversationChannel = pusherClient.subscribe(
      `private-conversation-${conversationId}`
    );

    // Bind message handlers
    conversationChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      // Cleanup subscriptions
      conversationChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, handleNewMessage]);
}
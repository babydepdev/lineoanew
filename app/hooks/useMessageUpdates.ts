"use client";

import { useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';

export function useMessageUpdates(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  const handleNewMessage = useCallback(
    (message: Message) => {
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
      `${PUSHER_CHANNELS.CONVERSATION}-${conversationId}`
    );

    // Subscribe to main chat channel
    const chatChannel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    // Bind message handlers
    conversationChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    chatChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      // Cleanup subscriptions
      conversationChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      chatChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(`${PUSHER_CHANNELS.CONVERSATION}-${conversationId}`);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [conversationId, handleNewMessage]);
}
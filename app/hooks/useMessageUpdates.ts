"use client";

import { useEffect, useCallback } from 'react';
import { Message } from '@prisma/client';
import { pusherClient, PUSHER_EVENTS } from '@/lib/pusher';
import { PusherMessage } from '../types/chat';

export function useMessageUpdates(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  const handleNewMessage = useCallback(
    (message: PusherMessage) => {
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
    const channel = pusherClient.subscribe(
      `private-conversation-${conversationId}`
    );

    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, handleNewMessage]);
}
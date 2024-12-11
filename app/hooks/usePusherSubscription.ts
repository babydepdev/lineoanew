"use client";

import { useEffect } from 'react';
import { Message } from '@prisma/client';
import { pusherClient, PUSHER_EVENTS } from '@/lib/pusher';
import { SerializedMessage } from '../types/chat';
import { mapApiMessageToMessage } from '@/lib/utils/messageMapper';

export function usePusherSubscription(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  useEffect(() => {
    // Subscribe to conversation-specific channel
    const channel = pusherClient.subscribe(`private-conversation-${conversationId}`);
    
    const handleNewMessage = (message: SerializedMessage) => {
      const processedMessage = mapApiMessageToMessage(message);
      onNewMessage(processedMessage);
    };

    // Bind to message events
    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    // Cleanup subscription
    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, onNewMessage]);
}
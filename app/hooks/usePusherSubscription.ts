"use client";

import { useEffect } from 'react';
import { Message } from '@prisma/client';
import { pusherClient } from '@/lib/pusher';
import { PUSHER_EVENTS, PUSHER_CHANNELS } from '@/app/constants/pusher';

export function usePusherSubscription(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  useEffect(() => {
    const mainChannel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);
    const conversationChannel = pusherClient.subscribe(`private-conversation-${conversationId}`);
    
    const handleNewMessage = (message: any) => {
      if (message.conversationId === conversationId) {
        onNewMessage({
          ...message,
          timestamp: new Date(message.timestamp)
        });
      }
    };

    mainChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    conversationChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      mainChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      conversationChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, onNewMessage]);
}
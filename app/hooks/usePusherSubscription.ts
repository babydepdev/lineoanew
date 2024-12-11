import { useEffect } from 'react';
import { Message } from '@prisma/client';
import { pusherClient } from '@/lib/pusher';
import { PUSHER_EVENTS, PUSHER_CHANNELS } from '@/app/constants/pusher';
import { PusherMessage } from '@/app/types/pusher';
import { mapApiMessageToMessage } from '@/app/utils/messageMapper';

interface UsePusherSubscriptionProps {
  conversationId: string;
  onNewMessage: (message: Message) => void;
}

export function usePusherSubscription({ 
  conversationId, 
  onNewMessage 
}: UsePusherSubscriptionProps) {
  useEffect(() => {
    if (!conversationId) {
      console.warn('No conversation ID provided for Pusher subscription');
      return;
    }

    try {
      // Subscribe to both main and conversation-specific channels
      const mainChannel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);
      const conversationChannel = pusherClient.subscribe(
        `private-conversation-${conversationId}`
      );

      const handleNewMessage = (message: PusherMessage) => {
        if (message.conversationId === conversationId) {
          const processedMessage = mapApiMessageToMessage(message);
          onNewMessage(processedMessage);
        }
      };

      // Bind event handlers
      mainChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      conversationChannel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);

      // Cleanup function
      return () => {
        mainChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
        conversationChannel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
        
        pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
        pusherClient.unsubscribe(`private-conversation-${conversationId}`);
      };
    } catch (error) {
      console.error('Error setting up Pusher subscription:', error);
    }
  }, [conversationId, onNewMessage]);
}
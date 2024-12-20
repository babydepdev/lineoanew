import { useEffect } from 'react';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useChatState } from '@/app/features/chat/useChatState';
import { Message } from '@prisma/client';

export function useConversationUpdates() {
  const { refreshConversations, addMessage } = useChatState();

  useEffect(() => {
    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleNewMessage = (message: Message) => {
      addMessage(message);
    };

    const handleConversationUpdate = () => {
      refreshConversations();
    };

    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdate);
    channel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationUpdate);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdate);
      channel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationUpdate);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [addMessage, refreshConversations]);
}
import { useEffect } from 'react';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useChatState } from '@/app/features/chat/useChatState';
import { Message } from '@prisma/client';
import { PusherConversation } from '../types/chat';

export function useConversationUpdates() {
  const { refreshConversations, addMessage, updateConversation } = useChatState();

  useEffect(() => {
    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleNewMessage = (message: Message) => {
      // Convert timestamp to Date object
      const messageWithDate = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      addMessage(messageWithDate);
      // Refresh conversations to update order
      refreshConversations();
    };

    const handleConversationUpdate = (conversation: PusherConversation) => {
      const formattedConversation = {
        ...conversation,
        messages: conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt)
      };
      updateConversation(formattedConversation);
      // Refresh conversations to update order
      refreshConversations();
    };

    const handleConversationsUpdate = () => {
      refreshConversations();
    };

    // Bind all event handlers
    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdate);
    channel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdate);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdate);
      channel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdate);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [addMessage, updateConversation, refreshConversations]);
}
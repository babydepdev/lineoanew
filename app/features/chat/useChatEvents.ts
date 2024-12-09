"use client";

import { useEffect } from 'react';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { SerializedConversation, ConversationWithMessages } from '@/app/types/chat';
import { useChatState } from './useChatState';

function deserializeConversation(conv: SerializedConversation): ConversationWithMessages {
  return {
    ...conv,
    messages: conv.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })),
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt)
  };
}

export function useChatEvents(initialConversations: SerializedConversation[]) {
  const { setConversations, updateConversation } = useChatState();

  // Initialize conversations
  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      const formattedConversations = initialConversations.map(deserializeConversation);
      setConversations(formattedConversations);
    }
  }, [initialConversations, setConversations]);

  // Subscribe to Pusher events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleConversationsUpdate = (conversations: SerializedConversation[]) => {
      console.log('Received conversations update:', conversations.length);
      const formattedConversations = conversations.map(deserializeConversation);
      setConversations(formattedConversations);
    };

    const handleConversationUpdate = (conversation: SerializedConversation) => {
      console.log('Received conversation update:', conversation.id);
      const formattedConversation = deserializeConversation(conversation);
      updateConversation(formattedConversation);
    };

    channel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdate);
    channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdate);

    return () => {
      channel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdate);
      channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdate);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [setConversations, updateConversation]);
}
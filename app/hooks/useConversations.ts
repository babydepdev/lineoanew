"use client";

import { useEffect } from 'react';
import { useConversationStore } from '../store/useConversationStore';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { ConversationWithMessages } from '../types/chat';

export function useConversations(initialConversations: ConversationWithMessages[]) {
  const { setConversations, updateConversation } = useConversationStore();

  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      setConversations(initialConversations);
    }
  }, [initialConversations, setConversations]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleConversationsUpdate = (conversations: ConversationWithMessages[]) => {
      const updatedConversations = conversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      }));
      setConversations(updatedConversations);
    };

    const handleConversationUpdate = (conversation: ConversationWithMessages) => {
      const updatedConversation = {
        ...conversation,
        messages: conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt)
      };
      updateConversation(updatedConversation);
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
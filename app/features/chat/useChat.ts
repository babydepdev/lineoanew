"use client";


import { SerializedConversation } from '@/app/types/chat';
import { useChatState } from './useChatState';
import { useChatEvents } from './useChatEvents';
import { useChatActions } from './useChatActions';

export function useChat(initialConversations: SerializedConversation[]) {
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation
  } = useChatState();
  
  const { sendMessage } = useChatActions();
  
  // Setup event handlers
  useChatEvents(initialConversations);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  };
}
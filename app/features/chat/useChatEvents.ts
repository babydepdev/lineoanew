"use client";

import { useEffect } from 'react';
import { SerializedConversation } from '@/app/types/chat';
import { useChatState } from './useChatState';
import { deserializeConversation } from '@/lib/utils/messageMapper';

export function useChatEvents(initialConversations: SerializedConversation[]) {
  const { setConversations } = useChatState();

  // Initialize conversations
  useEffect(() => {
    if (!Array.isArray(initialConversations)) return;

    const formattedConversations = initialConversations.map(deserializeConversation);
    setConversations(formattedConversations);
  }, [initialConversations, setConversations]);

  return null;
}
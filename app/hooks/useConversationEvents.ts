"use client";

import { useEffect } from 'react';
import { SerializedConversation } from '@/app/types/chat';
import { RuntimeConversation } from '@/app/types/conversation';
import { useChatState } from '../features/chat/useChatState';
import { deserializeConversation } from '../utils/messageMapper';

export function useConversationEvents(initialConversations: SerializedConversation[]) {
  const { setConversations } = useChatState();

  useEffect(() => {
    if (!Array.isArray(initialConversations)) return;

    const formattedConversations: RuntimeConversation[] = initialConversations.map(
      deserializeConversation
    );

    setConversations(formattedConversations);
  }, [initialConversations, setConversations]);
}
"use client";

import { useCallback } from 'react';
import { SerializedConversation, ConversationWithMessages } from '@/app/types/chat';
import { useChatState } from './useChatState';
import { useConversationEvents } from '@/app/hooks/useConversationEvents';
import { usePusherEvents } from '@/app/hooks/usePusherEvents';
import { APIResponse } from '@/app/types/api';

export function useChat(initialConversations: SerializedConversation[]) {
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation,
    updateConversation 
  } = useChatState();
  
  useConversationEvents(initialConversations);
  usePusherEvents();

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedConversation) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content,
          platform: selectedConversation.platform,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json() as APIResponse;
      
      if (data.conversation) {
        const updatedConversation: ConversationWithMessages = {
          ...data.conversation,
          messages: data.conversation.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          createdAt: new Date(data.conversation.createdAt),
          updatedAt: new Date(data.conversation.updatedAt),
          lineChannelId: data.conversation.lineChannelId,
          lineChannel: data.conversation.lineChannel
        };

        updateConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [selectedConversation, updateConversation]);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  };
}
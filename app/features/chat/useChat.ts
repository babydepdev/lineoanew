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
          id: data.conversation.id,
          platform: data.conversation.platform,
          channelId: data.conversation.channelId,
          userId: data.conversation.userId,
          messages: data.conversation.messages.map((msg) => ({
            id: msg.id,
            conversationId: msg.conversationId,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
            platform: msg.platform,
            externalId: msg.externalId,
            chatType: msg.chatType,
            chatId: msg.chatId,
            imageBase64: msg.imageBase64 || null // Add imageBase64 field with null fallback
          })),
          createdAt: new Date(data.conversation.createdAt),
          updatedAt: new Date(data.conversation.updatedAt),
          lineAccountId: data.conversation.lineAccountId
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
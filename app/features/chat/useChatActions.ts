"use client";

import { Message, Platform, SenderType } from '@prisma/client';
import { useChatState } from './useChatState';
import { APIResponse } from '@/app/types/api';
import { deserializeConversation } from '@/lib/utils/messageMapper';

export function useChatActions() {
  const { 
    selectedConversation, 
    updateConversation, 
    setSelectedConversation 
  } = useChatState();

  const sendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      // Create temporary message
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: selectedConversation.id,
        content,
        sender: 'BOT' as SenderType,
        timestamp: new Date(),
        platform: selectedConversation.platform as Platform,
        externalId: null,
        chatType: null,
        chatId: null
      };

      // Update conversation with temp message
      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, tempMessage].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ),
        updatedAt: new Date()
      };

      updateConversation(updatedConversation);

      // Send message to API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const finalConversation = deserializeConversation(data.conversation);
        updateConversation(finalConversation);
        setSelectedConversation(finalConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { sendMessage };
}
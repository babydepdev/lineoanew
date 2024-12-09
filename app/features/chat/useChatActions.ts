"use client";

import { useChatState } from './useChatState';
import { MessageResponse } from '@/app/types/api';
import { Message } from '@prisma/client';

export function useChatActions() {
  const { selectedConversation, updateConversation, setSelectedConversation } = useChatState();

  const sendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      console.log('Sending message:', {
        conversationId: selectedConversation.id,
        content,
        platform: selectedConversation.platform
      });

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

      const data = await response.json() as MessageResponse;
      
      if (data.conversation) {
        const updatedConversation = {
          ...data.conversation,
          messages: data.conversation.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          createdAt: new Date(data.conversation.createdAt),
          updatedAt: new Date(data.conversation.updatedAt)
        };
        
        console.log('Updating conversation with new message:', {
          conversationId: updatedConversation.id,
          messageCount: updatedConversation.messages.length
        });
        
        updateConversation(updatedConversation);
        setSelectedConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { sendMessage };
}
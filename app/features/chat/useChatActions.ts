"use client";

import { APIResponse } from '@/app/types/api';
import { ConversationWithMessages, MessageWithChat } from '@/app/types/chat';
import { createTempMessage, TempMessageParams } from '@/app/types/message';
import { Platform, SenderType } from '@prisma/client';
import { useChatState } from './useChatState';

export function useChatActions() {
  const { selectedConversation, updateConversation, setSelectedConversation } = useChatState();

  const sendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      // Create temporary message params
      const tempParams: TempMessageParams = {
        conversationId: selectedConversation.id,
        content,
        sender: 'BOT' as SenderType,
        platform: selectedConversation.platform as Platform
      };

      // Create temporary message with all required fields
      const tempMessage = createTempMessage(tempParams);

      // Update conversation with temporary message
      const updatedConversation: ConversationWithMessages = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, tempMessage].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ),
        updatedAt: new Date()
      };

      updateConversation(updatedConversation);

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
        const finalConversation: ConversationWithMessages = {
          id: data.conversation.id,
          platform: data.conversation.platform,
          channelId: data.conversation.channelId,
          userId: data.conversation.userId,
          messages: data.conversation.messages.map((msg): MessageWithChat => ({
            id: msg.id,
            conversationId: msg.conversationId,
            content: msg.content,
            contentType: msg.contentType || 'text',
            contentUrl: msg.contentUrl || null,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
            platform: msg.platform,
            externalId: msg.externalId,
            chatType: msg.chatType,
            chatId: msg.chatId
          })),
          createdAt: new Date(data.conversation.createdAt),
          updatedAt: new Date(data.conversation.updatedAt),
          lineAccountId: data.conversation.lineAccountId
        };

        updateConversation(finalConversation);
        setSelectedConversation(finalConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { sendMessage };
}
import { APIResponse } from '@/app/types/api';
import { ConversationWithMessages } from '@/app/types/chat';
import { useChatState } from './useChatState';
import { Message, Platform, SenderType } from '@prisma/client';

export function useChatActions() {
  const { selectedConversation, updateConversation, setSelectedConversation } = useChatState();

  const sendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      // Create temporary message with current timestamp
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: selectedConversation.id,
        content,
        sender: 'BOT' as SenderType,
        timestamp: new Date(),
        platform: selectedConversation.platform as Platform,
        externalId: null
      };

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
          ...data.conversation,
          messages: data.conversation.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          createdAt: new Date(data.conversation.createdAt),
          updatedAt: new Date(data.conversation.updatedAt)
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
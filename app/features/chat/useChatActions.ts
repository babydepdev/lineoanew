import { APIResponse, MessageResponse } from '@/app/types/api';
import { ConversationWithMessages } from '@/app/types/chat';
import { useChatState } from './useChatState';

export function useChatActions() {
  const { selectedConversation, updateConversation, setSelectedConversation } = useChatState();

  const sendMessage = async (content: string) => {
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
          messages: data.conversation.messages.map((msg: MessageResponse) => ({
            id: msg.id,
            conversationId: msg.conversationId,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
            platform: msg.platform,
            externalId: msg.externalId
          })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
          createdAt: new Date(data.conversation.createdAt),
          updatedAt: new Date(data.conversation.updatedAt)
        };

        updateConversation(updatedConversation);
        setSelectedConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { sendMessage };
}
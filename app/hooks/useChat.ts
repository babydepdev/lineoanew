import { useEffect } from 'react';
import type { ConversationWithMessages } from '../types/chat';
import type { APIResponse, MessageResponse } from '../types/api';
import { useConversationStore } from '../store/useConversationStore';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import type { PusherMessage, PusherConversation } from '../types/chat';

export function useChat(initialConversations: ConversationWithMessages[]) {
  const {
    conversations,
    selectedConversation,
    setConversations,
    setSelectedConversation,
    updateConversation,
    addMessage,
  } = useConversationStore();

  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      setConversations(initialConversations);
    }
  }, [initialConversations, setConversations]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleMessageReceived = (message: PusherMessage) => {
      if (!message?.id || !message?.conversationId) return;
      
      const updatedMessage = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      
      addMessage(updatedMessage);

      if (selectedConversation?.id === message.conversationId) {
        const updatedMessages = [...selectedConversation.messages, updatedMessage].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
        const updatedConversation = {
          ...selectedConversation,
          messages: updatedMessages,
          updatedAt: new Date()
        };
        setSelectedConversation(updatedConversation);
      }
    };

    const handleConversationUpdated = (pusherConversation: PusherConversation) => {
      if (!pusherConversation?.id) return;

      const updatedConversation = {
        ...pusherConversation,
        messages: pusherConversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
        createdAt: new Date(pusherConversation.createdAt),
        updatedAt: new Date(pusherConversation.updatedAt)
      } as ConversationWithMessages;

      updateConversation(updatedConversation);

      if (selectedConversation?.id === pusherConversation.id) {
        setSelectedConversation(updatedConversation);
      }
    };

    const handleConversationsUpdated = (conversations: PusherConversation[]) => {
      const formattedConversations = conversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt)
      })) as ConversationWithMessages[];

      setConversations(formattedConversations);
    };

    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
    channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
    channel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
      channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      channel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleConversationsUpdated);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [selectedConversation, addMessage, updateConversation, setSelectedConversation, setConversations]);

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

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  };
}
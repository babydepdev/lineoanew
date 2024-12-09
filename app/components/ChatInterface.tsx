"use client";

import React, { useEffect, useCallback } from 'react';
import { ConversationWithMessages, PusherMessage, PusherConversation } from '../types/chat';
import { MessageResponse } from '../types/api';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useConversationStore } from '../store/useConversationStore';
import { Message } from '@prisma/client';

interface ChatInterfaceProps {
  initialConversations: ConversationWithMessages[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialConversations }) => {
  const {
    conversations,
    selectedConversation,
    setConversations,
    setSelectedConversation,
    updateConversation,
  } = useConversationStore();

  const handleMessageReceived = useCallback((message: PusherMessage) => {
    if (!message?.conversationId) return;
    
    const conversation = conversations.find(c => c.id === message.conversationId);
    if (conversation) {
      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, {
          ...message,
          timestamp: new Date(message.timestamp)
        } as Message]
      };
      updateConversation(updatedConversation);
      
      if (selectedConversation?.id === message.conversationId) {
        setSelectedConversation(updatedConversation);
      }
    }
  }, [conversations, selectedConversation, updateConversation, setSelectedConversation]);

  const handleConversationUpdated = useCallback((conversation: PusherConversation) => {
    if (!conversation?.id) return;
    
    const updatedConversation = {
      ...conversation,
      messages: conversation.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })),
      createdAt: new Date(conversation.createdAt),
      updatedAt: new Date(conversation.updatedAt)
    } as ConversationWithMessages;
    
    updateConversation(updatedConversation);
    
    if (selectedConversation?.id === conversation.id) {
      setSelectedConversation(updatedConversation);
    }
  }, [selectedConversation, updateConversation, setSelectedConversation]);

  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      setConversations(initialConversations);
    }
  }, [initialConversations, setConversations]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);
    
    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
    channel.bind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
      channel.unbind(PUSHER_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, [handleMessageReceived, handleConversationUpdated]);

  const handleSendMessage = async (content: string) => {
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

      const data = await response.json() as MessageResponse;
      if (data.conversation) {
        const updatedConversation = {
          ...data.conversation,
          messages: data.conversation.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        } as ConversationWithMessages;
        updateConversation(updatedConversation);
        setSelectedConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ConversationList 
        conversations={conversations || []} 
        onSelect={setSelectedConversation}
        selectedId={selectedConversation?.id}
      />

      <div className="w-3/4 flex flex-col bg-white shadow-lg">
        {selectedConversation ? (
          <>
            <div className="p-4 bg-blue-500 text-white font-bold">
              {selectedConversation.platform} Chat - {selectedConversation.userId}
            </div>

            <MessageList messages={selectedConversation.messages || []} />
            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
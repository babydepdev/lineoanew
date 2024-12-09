"use client";

import React, { useEffect, useCallback } from 'react';
import { ConversationWithMessages } from '../types/chat';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';
import { useConversationStore } from '../store/useConversationStore';
import { Message } from '@prisma/client';
import type { PusherMessage, PusherConversation } from '@/lib/messageFormatter';

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
    addMessage,
  } = useConversationStore();

  const handleMessageReceived = useCallback((pusherMessage: PusherMessage) => {
    const message: Message = {
      ...pusherMessage,
      timestamp: new Date(pusherMessage.timestamp),
    };
    addMessage(message);
  }, [addMessage]);

  const handleConversationUpdated = useCallback((pusherConversation: PusherConversation) => {
    const conversation: ConversationWithMessages = {
      ...pusherConversation,
      messages: pusherConversation.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      createdAt: new Date(pusherConversation.createdAt),
      updatedAt: new Date(pusherConversation.updatedAt),
    };
    updateConversation(conversation);
  }, [updateConversation]);

  useEffect(() => {
    if (Array.isArray(initialConversations)) {
      setConversations(initialConversations);
      if (initialConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(initialConversations[0]);
      }
    }
  }, [initialConversations, setConversations, setSelectedConversation, selectedConversation]);

  useEffect(() => {
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
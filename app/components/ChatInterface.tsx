"use client";

import React from 'react';
import { ConversationWithMessages } from '../types/chat';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useConversationStore } from '../store/useConversationStore';
import { useConversations } from '../hooks/useConversations';
import { MessageResponse } from '../types/api';
import { Message } from '@prisma/client';

interface ChatInterfaceProps {
  initialConversations: ConversationWithMessages[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialConversations }) => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    updateConversation,
  } = useConversationStore();

  useConversations(initialConversations);

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
          messages: data.conversation.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
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

  return (
    <div className="flex h-screen bg-gray-100">
      <ConversationList 
        conversations={conversations} 
        onSelect={setSelectedConversation}
        selectedId={selectedConversation?.id}
      />

      <div className="w-3/4 flex flex-col bg-white shadow-lg">
        {selectedConversation ? (
          <>
            <div className="p-4 bg-blue-500 text-white font-bold">
              {selectedConversation.platform} Chat - {selectedConversation.userId}
            </div>

            <MessageList messages={selectedConversation.messages} />
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
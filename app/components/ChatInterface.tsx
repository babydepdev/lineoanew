"use client";

import React from 'react';
import { SerializedConversation } from '../types/chat';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../features/chat/useChat';

interface ChatInterfaceProps {
  initialConversations: SerializedConversation[];
}

export function ChatInterface({ initialConversations }: ChatInterfaceProps) {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
  } = useChat(initialConversations);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ConversationList 
        conversations={conversations} 
        onSelect={setSelectedConversation}
        selectedId={selectedConversation?.id}
      />

      <div className="w-3/4 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="p-4 bg-blue-500 text-white font-bold">
              {selectedConversation.platform} Chat - {selectedConversation.userId}
            </div>

            <MessageList conversationId={selectedConversation.id} />
            <MessageInput onSend={sendMessage} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
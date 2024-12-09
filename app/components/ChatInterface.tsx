"use client";

import React from 'react';
import { SerializedConversation } from '../types/chat';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../features/chat/useChat';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

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
    <div className="flex h-[calc(100vh-4rem)] rounded-lg overflow-hidden shadow-xl border border-slate-200">
      <ConversationList 
        conversations={conversations} 
        onSelect={setSelectedConversation}
        selectedId={selectedConversation?.id}
      />

      <Separator orientation="vertical" />

      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="px-6 py-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {selectedConversation.platform === 'LINE' ? 'L' : 'F'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {selectedConversation.platform} Chat
                  </h2>
                  <p className="text-sm text-slate-500">
                    User ID: {selectedConversation.userId}
                  </p>
                </div>
              </div>
            </div>

            <MessageList conversationId={selectedConversation.id} />
            <MessageInput onSend={sendMessage} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Welcome to Chat Dashboard
            </h3>
            <p className="text-slate-500 text-center max-w-sm">
              Select a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
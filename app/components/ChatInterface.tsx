"use client"
import React, { useRef, useState } from 'react';
import { SerializedConversation } from '../types/chat';
import { MessageListWithRef, MessageListHandle } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../features/chat/useChat';
import { Separator } from './ui/separator';
import { TypingIndicator } from './TypingIndicator';
import { Platform } from '@prisma/client';
import { Header } from './layout/Header';
import { Sidebar } from './chat/Sidebar';
import { ChatHeader } from './chat/ChatHeader';
import { MessageCircle } from 'lucide-react';
import { createTempMessage } from '../types/message';

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

  const messageListRef = useRef<MessageListHandle>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (selectedConversation) {
      const tempMessage = createTempMessage({
        conversationId: selectedConversation.id,
        content,
        sender: 'USER',
        platform: selectedConversation.platform as Platform
      });

      messageListRef.current?.addLocalMessage(tempMessage);
      await sendMessage(content);
    }
  };

  const handleConversationSelect = (conversation: typeof selectedConversation) => {
    setSelectedConversation(conversation);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen">
      <Header 
        toggleSidebar={toggleSidebar} 
        title="Chat Dashboard" 
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={handleConversationSelect}
          onClose={closeSidebar}
        />

        <Separator orientation="vertical" className="hidden lg:block" />

        <main className="flex-1 flex flex-col min-w-0 bg-white relative">
          {selectedConversation ? (
            <>
              <ChatHeader
                platform={selectedConversation.platform}
                userId={selectedConversation.userId}
              />

              <MessageListWithRef 
                ref={messageListRef}
                conversationId={selectedConversation.id} 
              />
              <TypingIndicator conversationId={selectedConversation.id} />
              <MessageInput 
                onSend={handleSendMessage}
                conversationId={selectedConversation.id}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-50">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 text-center">
                Welcome to Chat Dashboard
              </h3>
              <p className="text-sm sm:text-base text-slate-500 text-center max-w-sm">
                Select a conversation from the list to start chatting
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
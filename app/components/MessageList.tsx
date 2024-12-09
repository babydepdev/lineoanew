"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages';
import { Message } from '@prisma/client';

interface MessageListProps {
  conversationId: string;
}

export interface MessageListHandle {
  addLocalMessage: (message: Message) => void;
}

const MessageList = forwardRef<MessageListHandle, MessageListProps>(
  ({ conversationId }, ref) => {
    const { messages, isLoading, addMessage } = useRealtimeMessages(conversationId);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Auto-scroll to bottom when messages change
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, [messages]);

    // Function to add temporary user message
    const addLocalMessage = (message: Message) => {
      addMessage(message);
    };

    // Expose the addLocalMessage function to parent components
    useImperativeHandle(ref, () => ({
      addLocalMessage
    }), [addMessage]);

    if (isLoading) {
      return (
        <div className="flex-grow flex items-center justify-center bg-slate-50">
          <div className="animate-pulse text-slate-500">Loading messages...</div>
        </div>
      );
    }

    return (
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="p-6 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    );
  }
);

MessageList.displayName = 'MessageList';

export const MessageListWithRef = MessageList;
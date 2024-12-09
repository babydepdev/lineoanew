"use client";

import React, { useEffect, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages';

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { messages, isLoading } = useRealtimeMessages(conversationId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

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
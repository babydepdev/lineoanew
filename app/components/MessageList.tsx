"use client";

import React, { useEffect, useRef } from 'react';
import { useLineMessages } from '../hooks/useLineMessages';
import { ScrollArea } from './ui/scroll-area';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { botMessages, userMessages, isLoading, error } = useLineMessages(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [botMessages, userMessages]);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50">
        <div className="text-red-500">Error loading messages: {error.message}</div>
      </div>
    );
  }

  const allMessages = [...botMessages, ...userMessages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <ScrollArea className="flex-grow">
      <div className="p-6 space-y-4">
        {allMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
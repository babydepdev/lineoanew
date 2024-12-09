"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { useLineMessages } from '../hooks/useLineMessages';
import { ScrollArea } from './ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { pusherClient, PUSHER_EVENTS } from '@/lib/pusher';

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { botMessages, userMessages, isLoading, error } = useLineMessages(conversationId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [botMessages, userMessages, scrollToBottom]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`private-conversation-${conversationId}`);
    
    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, () => {
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId, scrollToBottom]);

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
    <ScrollArea className="flex-grow" ref={scrollAreaRef}>
      <div className="p-6 space-y-4">
        {allMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
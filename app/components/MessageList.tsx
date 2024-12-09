"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Message } from '@prisma/client';
import { ScrollArea } from './ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { useMessageUpdates } from '../hooks/useMessageUpdates';

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  const handleNewMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const exists = prev.some(m => m.id === message.id);
      if (exists) return prev;
      return [...prev, message].sort((a, b) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      );
    });
    setTimeout(scrollToBottom, 100);
  }, [scrollToBottom]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/line/${conversationId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        const allMessages = [...data.botMessages, ...data.userMessages]
          .map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        setMessages(allMessages);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, scrollToBottom]);

  // Subscribe to real-time updates
  useMessageUpdates(conversationId, handleNewMessage);

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
"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { useMessageStore } from '../hooks/useMessageStore';
import { useMessageUpdates } from '../hooks/useMessageUpdates';
import { Message } from '@prisma/client';

interface MessageListProps {
  conversationId: string;
  userId?: string; // Make userId optional
}

export interface MessageListHandle {
  addLocalMessage: (message: Message) => void;
}

const MessageList = forwardRef<MessageListHandle, MessageListProps>(
  ({ conversationId, userId }, ref) => {
    const { messages, addMessage, setMessages } = useMessageStore();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Subscribe to real-time updates
    useMessageUpdates(conversationId, addMessage);

    // Handle auto-scrolling
    useEffect(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, [messages]);

    // Load initial messages
    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/messages/line/${conversationId}`);
          if (!response.ok) throw new Error('Failed to fetch messages');
          
          const data = await response.json();
          const allMessages = [...data.botMessages, ...data.userMessages]
            .map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          
          setMessages(allMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }, [conversationId, setMessages]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      addLocalMessage: addMessage
    }));

    return (
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg}
              userId={userId} // Pass userId to MessageBubble if needed
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    );
  }
);

MessageList.displayName = 'MessageList';

export const MessageListWithRef = MessageList;
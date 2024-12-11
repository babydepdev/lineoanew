"use client";

import { useState, useCallback } from 'react';
import { Message } from '@prisma/client';

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

export function useMessageStore(): MessageStore {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Check if message already exists
      const exists = prev.some(msg => 
        msg.id === newMessage.id || 
        (msg.id.startsWith('temp-') && msg.content === newMessage.content)
      );
      
      if (exists) return prev;
      
      // Add new message and sort by timestamp
      return [...prev, {
        ...newMessage,
        timestamp: new Date(newMessage.timestamp),
        chatType: newMessage.chatType || null,
        chatId: newMessage.chatId || null
      }].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    });
  }, []);

  return { messages, setMessages, addMessage };
}
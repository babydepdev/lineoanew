"use client";

import { useState, useCallback, useEffect } from 'react';
import { Message } from '@prisma/client';
import { prefetchProfiles } from '@/lib/services/lineProfileService';

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

export function useMessageStore(): MessageStore {
  const [messages, setMessages] = useState<Message[]>([]);

  // Prefetch profiles when messages are set
  useEffect(() => {
    if (messages.length === 0) return;

    const userIds = messages
      .filter(msg => msg.platform === 'LINE' && msg.sender === 'USER')
      .map(msg => msg.conversationId);

    if (userIds.length > 0) {
      prefetchProfiles(userIds).catch(console.error);
    }
  }, [messages]);

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Check if message already exists
      const exists = prev.some(msg => 
        msg.id === newMessage.id || 
        (msg.id.startsWith('temp-') && msg.content === newMessage.content)
      );
      
      if (exists) return prev;
      
      // Add new message and sort by timestamp
      const updatedMessages = [...prev, {
        ...newMessage,
        timestamp: new Date(newMessage.timestamp)
      }].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Prefetch profile if it's a LINE user message
      if (newMessage.platform === 'LINE' && newMessage.sender === 'USER') {
        prefetchProfiles([newMessage.conversationId]).catch(console.error);
      }

      return updatedMessages;
    });
  }, []);

  return { messages, setMessages, addMessage };
}
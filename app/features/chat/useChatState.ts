"use client";

import { create } from 'zustand';
import { ConversationWithMessages } from '@/app/types/chat';
import { Message } from '@prisma/client';

interface ChatState {
  conversations: ConversationWithMessages[];
  selectedConversation: ConversationWithMessages | null;
  setConversations: (conversations: ConversationWithMessages[]) => void;
  setSelectedConversation: (conversation: ConversationWithMessages | null) => void;
  updateConversation: (updatedConversation: ConversationWithMessages) => void;
  addMessage: (message: Message) => void;
  refreshConversations: () => Promise<void>;
}

export const useChatState = create<ChatState>((set) => ({
  conversations: [],
  selectedConversation: null,
  setConversations: (conversations) => 
    set({ conversations: sortConversations(conversations) }),
  setSelectedConversation: (conversation) => 
    set({ selectedConversation: conversation }),
  updateConversation: (updatedConversation) =>
    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === updatedConversation.id ? updatedConversation : conv
      );

      return {
        conversations: sortConversations(updatedConversations),
        selectedConversation:
          state.selectedConversation?.id === updatedConversation.id
            ? updatedConversation
            : state.selectedConversation,
      };
    }),
  addMessage: (message) =>
    set((state) => {
      const conversationToUpdate = state.conversations.find(
        (conv) => conv.id === message.conversationId
      );

      if (!conversationToUpdate) return state;

      const messageExists = conversationToUpdate.messages.some(
        (msg) => msg.id === message.id
      );

      if (messageExists) return state;

      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            messages: sortMessages([...conv.messages, message]),
            updatedAt: message.timestamp
          };
        }
        return conv;
      });

      const updatedSelectedConversation = 
        state.selectedConversation?.id === message.conversationId
          ? {
              ...state.selectedConversation,
              messages: sortMessages([...state.selectedConversation.messages, message]),
              updatedAt: message.timestamp
            }
          : state.selectedConversation;

      return {
        conversations: sortConversations(updatedConversations),
        selectedConversation: updatedSelectedConversation,
      };
    }),
  refreshConversations: async () => {
    try {
      const response = await fetch('/api/webhooks/conversations', {
        headers: {
          'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch conversations');
      
      const conversations = await response.json();
      set({ conversations: sortConversations(conversations) });
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    }
  }
}));

function sortMessages(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function sortConversations(conversations: ConversationWithMessages[]): ConversationWithMessages[] {
  return [...conversations].sort((a, b) => {
    const aTime = new Date(a.updatedAt).getTime();
    const bTime = new Date(b.updatedAt).getTime();
    return bTime - aTime;
  });
}
"use client";

import { create } from 'zustand';
import { ChatState } from './types';

import { sortMessages, sortConversations } from '@/app/utils/sorting';

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
}));
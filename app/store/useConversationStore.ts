import { create } from 'zustand';
import { ConversationWithMessages } from '../types/chat';
import { Message } from '@prisma/client';

interface ConversationStore {
  conversations: ConversationWithMessages[];
  selectedConversation: ConversationWithMessages | null;
  setConversations: (conversations: ConversationWithMessages[]) => void;
  setSelectedConversation: (conversation: ConversationWithMessages | null) => void;
  updateConversation: (updatedConversation: ConversationWithMessages) => void;
  addMessage: (message: Message) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  conversations: [],
  selectedConversation: null,
  setConversations: (conversations) => set({ conversations }),
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  updateConversation: (updatedConversation) =>
    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === updatedConversation.id ? updatedConversation : conv
      );

      return {
        conversations: updatedConversations.sort((a, b) => {
          const aLastMessage = a.messages[a.messages.length - 1];
          const bLastMessage = b.messages[b.messages.length - 1];
          if (!aLastMessage) return 1;
          if (!bLastMessage) return -1;
          return bLastMessage.timestamp.getTime() - aLastMessage.timestamp.getTime();
        }),
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
            messages: [...conv.messages, message].sort((a, b) => 
              a.timestamp.getTime() - b.timestamp.getTime()
            ),
          };
        }
        return conv;
      }).sort((a, b) => {
        const aLastMessage = a.messages[a.messages.length - 1];
        const bLastMessage = b.messages[b.messages.length - 1];
        if (!aLastMessage) return 1;
        if (!bLastMessage) return -1;
        return bLastMessage.timestamp.getTime() - aLastMessage.timestamp.getTime();
      });

      const updatedSelectedConversation = 
        state.selectedConversation?.id === message.conversationId
          ? {
              ...state.selectedConversation,
              messages: [...state.selectedConversation.messages, message].sort((a, b) => 
                a.timestamp.getTime() - b.timestamp.getTime()
              ),
            }
          : state.selectedConversation;

      return {
        conversations: updatedConversations,
        selectedConversation: updatedSelectedConversation,
      };
    }),
}));
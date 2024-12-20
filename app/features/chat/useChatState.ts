import { create } from 'zustand';
import { ConversationWithMessages } from '../../types/chat';
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

export const useChatState = create<ChatState>((set, get) => ({
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

      const updatedConversation = {
        ...conversationToUpdate,
        messages: sortMessages([...conversationToUpdate.messages, message]),
        updatedAt: message.timestamp
      };

      const updatedConversations = state.conversations.map((conv) =>
        conv.id === message.conversationId ? updatedConversation : conv
      );

      return {
        conversations: sortConversations(updatedConversations),
        selectedConversation:
          state.selectedConversation?.id === message.conversationId
            ? updatedConversation
            : state.selectedConversation,
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

      // Update selected conversation if needed
      const state = get();
      if (state.selectedConversation) {
        const updatedSelected = conversations.find(
          (conv: ConversationWithMessages) => conv.id === state.selectedConversation?.id
        );
        if (updatedSelected) {
          set({ selectedConversation: updatedSelected });
        }
      }
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
  return [...conversations].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
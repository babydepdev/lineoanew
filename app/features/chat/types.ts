import { RuntimeConversation } from '@/app/types/conversation';
import { Message } from '@prisma/client';

export interface ChatState {
  conversations: RuntimeConversation[];
  selectedConversation: RuntimeConversation | null;
  setConversations: (conversations: RuntimeConversation[]) => void;
  setSelectedConversation: (conversation: RuntimeConversation | null) => void;
  updateConversation: (updatedConversation: RuntimeConversation) => void;
  addMessage: (message: Message) => void;
}

export interface ChatHookResult {
  conversations: RuntimeConversation[];
  selectedConversation: RuntimeConversation | null;
  setSelectedConversation: (conversation: RuntimeConversation | null) => void;
  sendMessage: (content: string) => Promise<void>;
}
import { Message } from '@prisma/client';
import { RuntimeConversation } from '../types/conversation';

export function sortMessages(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export function sortConversations(conversations: RuntimeConversation[]): RuntimeConversation[] {
  return [...conversations].sort((a, b) => {
    const aTime = new Date(a.updatedAt).getTime();
    const bTime = new Date(b.updatedAt).getTime();
    return bTime - aTime;
  });
}
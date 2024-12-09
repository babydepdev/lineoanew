import { Message, Conversation } from '@prisma/client';

export interface MessageResponse {
  message: Message & {
    conversation: Conversation;
  };
  conversation: Conversation & {
    messages: Message[];
  };
}
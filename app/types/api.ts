import { Message, Conversation } from '@prisma/client';

export interface MessageResponse {
  message: Message;
  conversation: Conversation & {
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
  };
}
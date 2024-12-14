import { PrismaClient, Message } from '@prisma/client';
import { MessageCreateParams } from './types/messageTypes';

const prisma = new PrismaClient();

export async function createMessage(params: MessageCreateParams): Promise<Message> {
  const {
    conversationId,
    content,
    sender,
    platform,
    timestamp,
    externalId,
    chatType,
    chatId,
    replyToken
  } = params;

  return prisma.message.create({
    data: {
      conversationId,
      content,
      sender,
      platform,
      timestamp: timestamp || new Date(),
      externalId,
      chatType,
      chatId,
      metadata: replyToken ? { replyToken } : undefined
    }
  });
}

export async function findMessageByExternalId(externalId: string): Promise<Message | null> {
  return prisma.message.findUnique({
    where: { externalId }
  });
}
import { PrismaClient, Message } from '@prisma/client';
import { MessageCreateParams } from './types';

const prisma = new PrismaClient();

export async function createMessage(params: MessageCreateParams): Promise<Message> {
  const { 
    conversationId, 
    content, 
    sender, 
    platform, 
    externalId, 
    timestamp,
    chatType,
    chatId,
    botId // Add botId parameter
  } = params;

  return prisma.message.create({
    data: {
      conversationId,
      content,
      sender,
      platform,
      externalId,
      timestamp: timestamp || new Date(),
      chatType,
      chatId,
      botId // Store the bot identifier
    }
  });
}
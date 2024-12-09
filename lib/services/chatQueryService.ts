import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function queryLineMessages(conversationId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        platform: 'LINE'
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    return {
      botMessages: messages.filter(msg => msg.sender === 'BOT'),
      userMessages: messages.filter(msg => msg.sender === 'USER')
    };
  } catch (error) {
    console.error('Error querying LINE messages:', error);
    throw error;
  }
}

export async function queryRecentLineConversations() {
  try {
    return await prisma.conversation.findMany({
      where: {
        platform: 'LINE'
      },
      include: {
        messages: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 50 // Limit to most recent messages
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 100 // Limit to most recent conversations
    });
  } catch (error) {
    console.error('Error querying LINE conversations:', error);
    throw error;
  }
}
import { PrismaClient } from '@prisma/client';
import { SerializedConversation } from '../types/chat';

const prisma = new PrismaClient();

export async function getConversations(): Promise<SerializedConversation[]> {
  try {
    console.log('Fetching all conversations...');
    
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    console.log(`Found ${conversations.length} conversations`);

    return conversations.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
        metadata: msg.metadata || null
      })),
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
      lineAccountId: conv.lineAccountId || null
    }));
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}
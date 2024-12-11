import { PrismaClient } from '@prisma/client';
import { ChatInterface } from './components/ChatInterface';
import { SerializedConversation } from './types/chat';

const prisma = new PrismaClient();

async function getConversations(): Promise<SerializedConversation[]> {
  try {
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

    return conversations.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
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

export default async function Home() {
  const conversations = await getConversations();

  return (
    <div className="h-screen bg-background overflow-hidden">
      <ChatInterface initialConversations={conversations} />
    </div>
  );
}
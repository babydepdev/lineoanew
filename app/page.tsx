import { PrismaClient } from '@prisma/client';
import { ChatInterface } from './components/ChatInterface';
import { SerializedConversation } from './types/chat';
import { serializeConversation } from './utils/serializers';

const prisma = new PrismaClient();

async function getConversations(): Promise<SerializedConversation[]> {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        },
        lineChannel: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return conversations.map(serializeConversation);
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
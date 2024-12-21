import { PrismaClient } from '@prisma/client';
import { ChatInterface } from './components/ChatInterface';
import { DashboardMetrics } from './dashboard/components/DashboardMetrics';
import { SerializedConversation } from './types/chat';
import { getDashboardMetrics } from './dashboard/services/metrics';

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
  const [conversations, metrics] = await Promise.all([
    getConversations(),
    getDashboardMetrics()
  ]);

  return (
    <div className="h-screen bg-background overflow-hidden flex">
      {/* Chat Interface - Left Side */}
      <div className="flex-1 min-w-0">
        <ChatInterface initialConversations={conversations} />
      </div>

      {/* Dashboard - Right Side */}
      <div className="w-[400px] border-l border-slate-200 bg-slate-50 overflow-y-auto">
        <DashboardMetrics metrics={metrics} />
      </div>
    </div>
  );
}
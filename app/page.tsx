import { PrismaClient } from '@prisma/client';
import { ChatInterface } from './components/ChatInterface';
import { SerializedConversation } from './types/chat';
import { getConversations } from './services/conversation';

export default async function Home() {
  const conversations = await getConversations();

  return (
    <div className="h-screen bg-background overflow-hidden">
      <ChatInterface initialConversations={conversations} />
    </div>
  );
}
import { PrismaClient } from '@prisma/client';
import { DashboardMetrics } from '../types';
import { getMessagesByAccount, getTotalMessageCount } from './queries/messageQueries';
import { getConversationsByLineAccount } from './queries/conversationQueries';

const prisma = new PrismaClient();

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [quotations, lineAccounts, totalMessages, conversations] = await Promise.all([
    prisma.quotation.count(),
    prisma.lineAccount.findMany({
      where: { active: true }
    }),
    getTotalMessageCount(),
    getConversationsByLineAccount()
  ]);

  // Create a map of conversation counts by account ID
  const conversationCountMap = new Map(
    conversations.map(conv => [conv.lineAccountId, conv._count._all])
  );

  // Get message counts for each account
  const messageCountPromises = lineAccounts.map(account => 
    getMessagesByAccount(account.id)
  );
  const messageCounts = await Promise.all(messageCountPromises);

  const accountStats = lineAccounts.map((account, index) => ({
    id: account.id,
    name: account.name,
    conversations: conversationCountMap.get(account.id) || 0,
    messages: messageCounts[index]
  }));

  return {
    totalQuotations: quotations,
    totalAccounts: lineAccounts.length,
    totalMessages,
    accountStats
  };
}
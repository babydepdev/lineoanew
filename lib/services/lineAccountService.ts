import { PrismaClient } from '@prisma/client';
import { Client } from '@line/bot-sdk';

const prisma = new PrismaClient();

// Cache for LINE clients
const lineClients: Map<string, Client> = new Map();

export async function getLineClientForAccount(accountId: string): Promise<Client> {
  // Check cache first
  if (lineClients.has(accountId)) {
    return lineClients.get(accountId)!;
  }

  // Get account from database
  const account = await prisma.lineAccount.findUnique({
    where: { id: accountId }
  });

  if (!account) {
    throw new Error(`LINE account not found: ${accountId}`);
  }

  // Create new client
  const client = new Client({
    channelAccessToken: account.channelAccessToken,
    channelSecret: account.channelSecret
  });

  // Cache the client
  lineClients.set(accountId, client);

  return client;
}

export async function findLineAccountBySecret(channelSecret: string) {
  return prisma.lineAccount.findFirst({
    where: {
      channelSecret,
      active: true
    }
  });
}

export async function createLineAccount(data: {
  name: string;
  channelAccessToken: string;
  channelSecret: string;
}) {
  return prisma.lineAccount.create({
    data: {
      ...data,
      active: true
    }
  });
}

export async function updateLineAccount(id: string, data: {
  name?: string;
  channelAccessToken?: string;
  channelSecret?: string;
  active?: boolean;
}) {
  const account = await prisma.lineAccount.update({
    where: { id },
    data
  });

  // Clear cached client if credentials updated
  if (data.channelAccessToken || data.channelSecret) {
    lineClients.delete(id);
  }

  return account;
}

export async function getActiveLineAccounts() {
  return prisma.lineAccount.findMany({
    where: { active: true }
  });
}
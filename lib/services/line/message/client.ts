import { Client } from '@line/bot-sdk';
import { findLineAccountById } from '../account';

const clients = new Map<string, Client>();

export async function getLineClient(accountId?: string | null): Promise<Client | null> {
  try {
    // Use default account if no ID provided
    if (!accountId) {
      if (!process.env.LINE_CHANNEL_ACCESS_TOKEN || !process.env.LINE_CHANNEL_SECRET) {
        console.error('Default LINE credentials not configured');
        return null;
      }

      return new Client({
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
        channelSecret: process.env.LINE_CHANNEL_SECRET
      });
    }

    // Check cache first
    const cachedClient = clients.get(accountId);
    if (cachedClient) {
      return cachedClient;
    }

    // Get account details
    const account = await findLineAccountById(accountId);
    if (!account) {
      console.error('LINE account not found:', accountId);
      return null;
    }

    // Create new client
    const client = new Client({
      channelAccessToken: account.channelAccessToken,
      channelSecret: account.channelSecret
    });

    // Cache client
    clients.set(accountId, client);
    return client;
  } catch (error) {
    console.error('Error getting LINE client:', error);
    return null;
  }
}

export function clearLineClient(accountId: string): void {
  clients.delete(accountId);
}

export function clearAllLineClients(): void {
  clients.clear();
}
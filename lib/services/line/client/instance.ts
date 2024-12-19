import { Client } from '@line/bot-sdk';
import { LineAccount } from '@/app/types/line';
import { getActiveLineAccounts } from '../account/find';

class LineClientManager {
  private static defaultClient: Client | null = null;
  private static accountClients = new Map<string, Client>();

  static async getClient(account?: LineAccount): Promise<Client> {
    // If specific account provided, use or create its client
    if (account) {
      let client = this.accountClients.get(account.id);
      if (!client) {
        client = new Client({
          channelAccessToken: account.channelAccessToken,
          channelSecret: account.channelSecret
        });
        this.accountClients.set(account.id, client);
      }
      return client;
    }

    // Get or create default client using first active account
    if (!this.defaultClient) {
      const accounts = await getActiveLineAccounts();
      if (accounts.length === 0) {
        throw new Error('No active LINE account found');
      }
      
      this.defaultClient = new Client({
        channelAccessToken: accounts[0].channelAccessToken,
        channelSecret: accounts[0].channelSecret
      });
    }

    return this.defaultClient;
  }

  static clearClients(): void {
    this.defaultClient = null;
    this.accountClients.clear();
  }

  static removeClient(accountId: string): void {
    this.accountClients.delete(accountId);
  }
}

export const getLineClient = LineClientManager.getClient.bind(LineClientManager);
export const clearLineClients = LineClientManager.clearClients.bind(LineClientManager);
export const removeLineClient = LineClientManager.removeClient.bind(LineClientManager);
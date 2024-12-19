import { Client } from '@line/bot-sdk';
import { getLineClientConfig } from './config';
import { LineAccount } from '@/app/types/line';
import { LineClientManager } from './types';

class DefaultLineClientManager implements LineClientManager {
  private defaultClient: Client | null = null;
  private accountClients = new Map<string, Client>();

  getClient(account?: LineAccount): Client {
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

    if (!this.defaultClient) {
      const config = getLineClientConfig();
      this.defaultClient = new Client(config);
    }
    return this.defaultClient;
  }

  clearClients(): void {
    this.defaultClient = null;
    this.accountClients.clear();
  }
}

// Create singleton instance
const clientManager = new DefaultLineClientManager();

// Export functions that use the singleton
export const getLineClient = (account?: LineAccount) => clientManager.getClient(account);
export const clearLineClients = () => clientManager.clearClients();
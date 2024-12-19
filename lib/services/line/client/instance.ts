import { Client } from '@line/bot-sdk';
import { createLineClientConfig } from './config';
import { LineAccount } from '@/app/types/line';
import { LineClientManager } from './types';

class DefaultLineClientManager implements LineClientManager {
  private defaultClient: Client | null = null;
  private accountClients = new Map<string, Client>();

  getClient(account?: LineAccount): Client {
    if (account) {
      let client = this.accountClients.get(account.id);
      if (!client) {
        const config = createLineClientConfig(
          account.channelAccessToken,
          account.channelSecret
        );
        client = new Client(config);
        this.accountClients.set(account.id, client);
      }
      return client;
    }

    if (!this.defaultClient) {
      if (!process.env.LINE_CHANNEL_ACCESS_TOKEN || !process.env.LINE_CHANNEL_SECRET) {
        throw new Error('LINE credentials not configured');
      }
      
      const config = createLineClientConfig(
        process.env.LINE_CHANNEL_ACCESS_TOKEN,
        process.env.LINE_CHANNEL_SECRET
      );
      
      this.defaultClient = new Client(config);
    }
    return this.defaultClient;
  }

  clearClients(): void {
    this.defaultClient = null;
    this.accountClients.clear();
  }
}

// Export singleton instance
export const clientManager = new DefaultLineClientManager();

// Export convenience function
export const getLineClient = (account?: LineAccount) => clientManager.getClient(account);
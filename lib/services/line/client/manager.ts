import { Client } from '@line/bot-sdk';
import { LineAccount } from '@/app/types/line';
import { getLineClientConfig } from './config';

class LineClientManager {
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
      this.defaultClient = new Client(getLineClientConfig());
    }
    return this.defaultClient;
  }

  clearClients(): void {
    this.defaultClient = null;
    this.accountClients.clear();
  }
}

// Export singleton instance
export const clientManager = new LineClientManager();
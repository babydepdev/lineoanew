import { Client } from '@line/bot-sdk';
import { LineAccount } from '@/app/types/line';

class LineClientManager {
  private static clients: Map<string, Client> = new Map();

  static getClient(account: LineAccount): Client {
    let client = this.clients.get(account.id);
    
    if (!client) {
      client = new Client({
        channelAccessToken: account.channelAccessToken,
        channelSecret: account.channelSecret
      });
      this.clients.set(account.id, client);
    }
    
    return client;
  }

  static removeClient(accountId: string): void {
    this.clients.delete(accountId);
  }

  static clearClients(): void {
    this.clients.clear();
  }
}

export default LineClientManager;
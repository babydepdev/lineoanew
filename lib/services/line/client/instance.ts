import { Client } from '@line/bot-sdk';
import { getLineClientConfig } from './config';
import { LineAccount } from '@/app/types/line';

let defaultClient: Client | null = null;
const accountClients = new Map<string, Client>();

export function getLineClient(account?: LineAccount): Client {
  if (account) {
    let client = accountClients.get(account.id);
    if (!client) {
      client = new Client({
        channelAccessToken: account.channelAccessToken,
        channelSecret: account.channelSecret
      });
      accountClients.set(account.id, client);
    }
    return client;
  }

  if (!defaultClient) {
    const config = getLineClientConfig();
    defaultClient = new Client(config);
  }
  return defaultClient;
}

export function clearLineClient(): void {
  defaultClient = null;
  accountClients.clear();
}
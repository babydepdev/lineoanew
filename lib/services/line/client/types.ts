import { Client, ClientConfig } from '@line/bot-sdk';
import { LineAccount } from '@/app/types/line';

export interface LineClientManager {
  getClient(account?: LineAccount): Client;
  clearClients(): void;
}

export interface LineClientConfig extends ClientConfig {
  accountId?: string;
}

export interface LineClientOptions {
  config: LineClientConfig;
  account?: LineAccount;
}
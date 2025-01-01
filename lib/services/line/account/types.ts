import { LineAccount } from '@/app/types/line';

export interface LineAccountCreateParams {
  name: string;
  channelAccessToken: string;
  channelSecret: string;
}

export interface LineAccountUpdateParams {
  name?: string;
  companyName?: string | null;
  channelAccessToken?: string;
  channelSecret?: string;
  active?: boolean;
}

export interface LineAccountResult {
  success: boolean;
  account?: LineAccount;
  error?: string;
}
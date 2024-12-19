import { ClientConfig } from '@line/bot-sdk';
import { lineConfig } from '@/lib/config/line';

export function getLineClientConfig(): ClientConfig {
  return {
    channelAccessToken: lineConfig.channelAccessToken,
    channelSecret: lineConfig.channelSecret
  };
}
import { ClientConfig } from '@line/bot-sdk';

export function createLineClientConfig(
  channelAccessToken: string,
  channelSecret: string
): ClientConfig {
  return {
    channelAccessToken,
    channelSecret
  };
}
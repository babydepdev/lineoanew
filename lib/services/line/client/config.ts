import { ClientConfig } from '@line/bot-sdk';

export function createLineClientConfig(
  channelAccessToken: string,
  channelSecret: string
): ClientConfig {
  if (!channelAccessToken || !channelSecret) {
    throw new Error('Missing required LINE credentials');
  }
  
  return {
    channelAccessToken,
    channelSecret
  };
}
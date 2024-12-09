import { Client } from '@line/bot-sdk';
import { lineConfig, isLineConfigured } from '../config/line';

let lineClient: Client | null = null;

export function getLineClient(): Client {
  if (!lineClient) {
    if (!isLineConfigured()) {
      throw new Error('LINE configuration is missing');
    }

    lineClient = new Client({
      channelAccessToken: lineConfig.channelAccessToken,
      channelSecret: lineConfig.channelSecret
    });
  }

  return lineClient;
}

export async function sendLineMessage(userId: string, message: string): Promise<boolean> {
  try {
    const client = getLineClient();
    await client.pushMessage(userId, {
      type: 'text',
      text: message
    });
    return true;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}
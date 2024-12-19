import { Client } from '@line/bot-sdk';
import { getImageBuffer } from './process';

export async function getImageBase64(
  client: Client,
  messageId: string
): Promise<string> {
  try {
    const buffer = await getImageBuffer(client, messageId);
    return buffer.toString('base64');
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}
import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { LineChannel } from '@/app/types/line';

const prisma = new PrismaClient();
const clientCache = new Map<string, Client>();

export async function getLineClient(channelId: string): Promise<Client> {
  // Check cache first
  if (clientCache.has(channelId)) {
    return clientCache.get(channelId)!;
  }

  // Get channel from database
  const channel = await prisma.lineChannel.findUnique({
    where: { id: channelId }
  });

  if (!channel) {
    throw new Error(`LINE channel not found: ${channelId}`);
  }

  // Create new client with channel credentials
  const client = new Client({
    channelAccessToken: channel.accessToken,
    channelSecret: channel.secret
  });

  // Cache the client
  clientCache.set(channelId, client);
  return client;
}

export async function sendLineMessage(
  userId: string,
  content: string,
  channelId: string
): Promise<boolean> {
  try {
    console.log('Sending LINE message:', { userId, content, channelId });
    const client = await getLineClient(channelId);
    await client.pushMessage(userId, {
      type: 'text',
      text: content
    });
    console.log('LINE message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}

export async function getAllLineChannels(): Promise<LineChannel[]> {
  const channels = await prisma.lineChannel.findMany({
    include: {
      _count: {
        select: {
          conversations: true,
          userProfiles: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  return channels;
}
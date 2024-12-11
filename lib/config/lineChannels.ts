import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LineChannelConfig {
  id: string;
  channelId: string;
  name: string;
  accessToken: string;
  secret: string;
}

let channelsCache: LineChannelConfig[] | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let lastCacheUpdate = 0;

export async function getLineChannels(): Promise<LineChannelConfig[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (channelsCache && (now - lastCacheUpdate) < CACHE_TTL) {
    return channelsCache;
  }

  try {
    const channels = await prisma.lineChannel.findMany({
      select: {
        id: true,
        channelId: true,
        name: true,
        accessToken: true,
        secret: true
      }
    });

    channelsCache = channels;
    lastCacheUpdate = now;
    return channels;
  } catch (error) {
    console.error('Error fetching LINE channels:', error);
    throw error;
  }
}

export async function getLineChannelByChannelId(channelId: string): Promise<LineChannelConfig | null> {
  try {
    // Try to find in cache first
    if (channelsCache) {
      const cachedChannel = channelsCache.find(ch => ch.channelId === channelId);
      if (cachedChannel) return cachedChannel;
    }

    // If not in cache or cache is invalid, fetch from database
    const channel = await prisma.lineChannel.findUnique({
      where: { channelId },
      select: {
        id: true,
        channelId: true,
        name: true,
        accessToken: true,
        secret: true
      }
    });

    return channel;
  } catch (error) {
    console.error('Error fetching LINE channel:', error);
    throw error;
  }
}
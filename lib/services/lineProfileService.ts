import { LineUserProfile } from '@/app/types/line';
import { getLineClient } from './lineService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getLineUserProfile(userId: string, channelId: string): Promise<LineUserProfile | null> {
  try {
    // Check cache first
    const cachedProfile = await prisma.userProfile.findFirst({
      where: { 
        userId,
        platform: 'LINE',
        lineChannelId: channelId
      }
    });

    // If we have a fresh cached profile, return it
    if (cachedProfile && isProfileFresh(cachedProfile.updatedAt)) {
      return {
        userId: cachedProfile.userId,
        displayName: cachedProfile.displayName,
        pictureUrl: cachedProfile.pictureUrl || undefined,
        statusMessage: cachedProfile.statusMessage || undefined,
        platform: 'LINE',
        channelId: cachedProfile.lineChannelId
      };
    }

    // If cache is stale or doesn't exist, fetch from LINE API
    const client = await getLineClient(channelId);
    const profile = await client.getProfile(userId);

    // Update cache using upsert with unique constraint
    const updatedProfile = await prisma.userProfile.upsert({
      where: { 
        id: cachedProfile?.id || 'temp-id'
      },
      create: {
        userId: profile.userId,
        platform: 'LINE',
        lineChannelId: channelId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      },
      update: {
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
        updatedAt: new Date()
      }
    });

    return {
      userId: updatedProfile.userId,
      displayName: updatedProfile.displayName,
      pictureUrl: updatedProfile.pictureUrl || undefined,
      statusMessage: updatedProfile.statusMessage || undefined,
      platform: 'LINE',
      channelId
    };
  } catch (error) {
    console.error('Error fetching LINE user profile:', error);
    return null;
  }
}

function isProfileFresh(updatedAt: Date): boolean {
  return Date.now() - updatedAt.getTime() < CACHE_DURATION;
}
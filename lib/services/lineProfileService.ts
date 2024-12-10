
import { LineUserProfile } from '@/app/types/line';
import { getLineClient } from './lineService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getLineUserProfile(userId: string): Promise<LineUserProfile | null> {
  try {
    // Check cache first
    const cachedProfile = await prisma.userProfile.findUnique({
      where: { userId_platform: { userId, platform: 'LINE' } }
    });

    if (cachedProfile && isProfileFresh(cachedProfile.updatedAt)) {
      return {
        userId: cachedProfile.userId,
        displayName: cachedProfile.displayName,
        pictureUrl: cachedProfile.pictureUrl || undefined,
        statusMessage: cachedProfile.statusMessage || undefined,
        platform: 'LINE'
      };
    }

    // Fetch fresh profile from LINE
    const client = getLineClient();
    const profile = await client.getProfile(userId);

    // Update cache
    await prisma.userProfile.upsert({
      where: { userId_platform: { userId, platform: 'LINE' } },
      create: {
        userId: profile.userId,
        platform: 'LINE',
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
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
      platform: 'LINE'
    };
  } catch (error) {
    console.error('Error fetching LINE user profile:', error);
    return null;
  }
}

function isProfileFresh(updatedAt: Date): boolean {
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  return Date.now() - updatedAt.getTime() < CACHE_DURATION;
}
import { LineUserProfile } from '@/app/types/line';
import { getLineClient } from './lineService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getLineUserProfile(userId: string): Promise<LineUserProfile | null> {
  try {
    // Check cache first
    const cachedProfile = await prisma.userProfile.findUnique({
      where: { 
        userId_platform: { 
          userId, 
          platform: 'LINE' 
        } 
      }
    });

    // If we have a fresh cached profile, return it
    if (cachedProfile && isProfileFresh(cachedProfile.updatedAt)) {
      return {
        userId: cachedProfile.userId,
        displayName: cachedProfile.displayName,
        pictureUrl: cachedProfile.pictureUrl || undefined,
        statusMessage: cachedProfile.statusMessage || undefined,
        platform: 'LINE'
      };
    }

    // If cache is stale or doesn't exist, fetch from LINE API
    const client = getLineClient();
    const profile = await client.getProfile(userId);

    // Update cache
    await prisma.userProfile.upsert({
      where: { 
        userId_platform: { 
          userId, 
          platform: 'LINE' 
        } 
      },
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
    
    // If API fails, return cached profile even if stale
    const staleProfile = await prisma.userProfile.findUnique({
      where: { 
        userId_platform: { 
          userId, 
          platform: 'LINE' 
        } 
      }
    });

    if (staleProfile) {
      return {
        userId: staleProfile.userId,
        displayName: staleProfile.displayName,
        pictureUrl: staleProfile.pictureUrl || undefined,
        statusMessage: staleProfile.statusMessage || undefined,
        platform: 'LINE'
      };
    }

    return null;
  }
}

function isProfileFresh(updatedAt: Date): boolean {
  return Date.now() - updatedAt.getTime() < CACHE_DURATION;
}
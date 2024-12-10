import { LineUserProfile } from '@/app/types/line';
import { getLineClient } from './lineService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In-memory cache for profiles
const profileCache = new Map<string, {
  profile: LineUserProfile;
  timestamp: number;
}>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_STALE_DURATION = 12 * 60 * 60 * 1000; // 12 hours - time before refreshing cache

export async function getLineUserProfile(userId: string): Promise<LineUserProfile | null> {
  try {
    // Check in-memory cache first
    const cachedData = profileCache.get(userId);
    const now = Date.now();

    if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      // If cache is not stale, return immediately
      if ((now - cachedData.timestamp) < CACHE_STALE_DURATION) {
        return cachedData.profile;
      }
      
      // If cache is stale but not expired, return cache and refresh in background
      refreshProfileInBackground(userId);
      return cachedData.profile;
    }

    // Check database cache
    const dbProfile = await prisma.userProfile.findUnique({
      where: { userId_platform: { userId, platform: 'LINE' } }
    });

    if (dbProfile && isProfileFresh(dbProfile.updatedAt)) {
      const profile = {
        userId: dbProfile.userId,
        displayName: dbProfile.displayName,
        pictureUrl: dbProfile.pictureUrl || undefined,
        statusMessage: dbProfile.statusMessage || undefined,
        platform: 'LINE' as const
      };

      // Update in-memory cache
      profileCache.set(userId, { profile, timestamp: now });
      return profile;
    }

    // Fetch fresh profile from LINE
    const profile = await fetchAndCacheProfile(userId);
    return profile;
  } catch (error) {
    console.error('Error fetching LINE user profile:', error);
    
    // Return cached data if available, even if expired
    const cachedData = profileCache.get(userId);
    if (cachedData) {
      return cachedData.profile;
    }
    
    return null;
  }
}

async function fetchAndCacheProfile(userId: string): Promise<LineUserProfile> {
  const client = getLineClient();
  const profile = await client.getProfile(userId);
  const now = Date.now();

  const lineProfile: LineUserProfile = {
    userId: profile.userId,
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
    statusMessage: profile.statusMessage,
    platform: 'LINE'
  };

  // Update both caches
  profileCache.set(userId, { profile: lineProfile, timestamp: now });
  
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

  return lineProfile;
}

async function refreshProfileInBackground(userId: string): Promise<void> {
  try {
    await fetchAndCacheProfile(userId);
  } catch (error) {
    console.error('Error refreshing profile in background:', error);
  }
}

function isProfileFresh(updatedAt: Date): boolean {
  return Date.now() - updatedAt.getTime() < CACHE_DURATION;
}

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of profileCache.entries()) {
    if (now - data.timestamp > CACHE_DURATION) {
      profileCache.delete(userId);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour
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
const CACHE_STALE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
const BATCH_SIZE = 10; // Maximum number of profiles to fetch at once

export async function getLineUserProfile(userId: string): Promise<LineUserProfile | null> {
  if (!userId) {
    throw new Error('userId is required');
  }

  try {
    const profile = await getProfileFromCache(userId);
    if (profile) return profile;
    
    return await fetchAndCacheProfile(userId);
  } catch (error) {
    console.error('Error fetching LINE user profile:', error);
    return profileCache.get(userId)?.profile || null;
  }
}

export async function prefetchProfiles(userIds: string[]): Promise<Map<string, LineUserProfile>> {
  const uniqueIds = [...new Set(userIds)].filter(Boolean);
  const results = new Map<string, LineUserProfile>();
  const idsToFetch: string[] = [];

  // Check cache first
  for (const userId of uniqueIds) {
    const cached = await getProfileFromCache(userId);
    if (cached) {
      results.set(userId, cached);
    } else {
      idsToFetch.push(userId);
    }
  }

  // Batch fetch missing profiles
  if (idsToFetch.length > 0) {
    const batches = chunk(idsToFetch, BATCH_SIZE);
    await Promise.all(
      batches.map(async (batch) => {
        const profiles = await fetchProfileBatch(batch);
        profiles.forEach((profile) => {
          if (profile) {
            results.set(profile.userId, profile);
          }
        });
      })
    );
  }

  return results;
}

async function getProfileFromCache(userId: string): Promise<LineUserProfile | null> {
  const now = Date.now();
  const cachedData = profileCache.get(userId);

  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    if ((now - cachedData.timestamp) >= CACHE_STALE_DURATION) {
      void refreshProfileInBackground(userId);
    }
    return cachedData.profile;
  }

  const dbProfile = await prisma.userProfile.findUnique({
    where: { userId_platform: { userId, platform: 'LINE' } }
  });

  if (dbProfile && isProfileFresh(dbProfile.updatedAt)) {
    const profile = mapDbProfileToLineProfile(dbProfile);
    profileCache.set(userId, { profile, timestamp: now });
    return profile;
  }

  return null;
}

async function fetchProfileBatch(userIds: string[]): Promise<(LineUserProfile | null)[]> {
  const client = getLineClient();
  const now = Date.now();

  const profiles = await Promise.all(
    userIds.map(async (userId) => {
      try {
        const profile = await client.getProfile(userId);
        const lineProfile = {
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage,
          platform: 'LINE' as const
        };

        // Update caches
        profileCache.set(userId, { profile: lineProfile, timestamp: now });
        await updateDbProfile(lineProfile);

        return lineProfile;
      } catch (error) {
        console.error(`Error fetching profile for user ${userId}:`, error);
        return null;
      }
    })
  );

  return profiles;
}

async function fetchAndCacheProfile(userId: string): Promise<LineUserProfile | null> {
  const [profile] = await fetchProfileBatch([userId]);
  return profile;
}

async function updateDbProfile(profile: LineUserProfile): Promise<void> {
  await prisma.userProfile.upsert({
    where: { userId_platform: { userId: profile.userId, platform: 'LINE' } },
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
}

function mapDbProfileToLineProfile(dbProfile: any): LineUserProfile {
  return {
    userId: dbProfile.userId,
    displayName: dbProfile.displayName,
    pictureUrl: dbProfile.pictureUrl || undefined,
    statusMessage: dbProfile.statusMessage || undefined,
    platform: 'LINE' as const
  };
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

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of profileCache.entries()) {
    if (now - data.timestamp > CACHE_DURATION) {
      profileCache.delete(userId);
    }
  }
}, 60 * 60 * 1000);
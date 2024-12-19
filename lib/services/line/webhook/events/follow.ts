import { LineMessageEvent, LineAccount } from '@/app/types/line';
import { getLineUserProfile } from '@/lib/services/lineProfileService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function processFollowEvent(
  event: LineMessageEvent,
  account: LineAccount
) {
  try {
    const userId = event.source.userId;

    // Get user profile
    const profile = await getLineUserProfile(userId);
    if (!profile) {
      return {
        success: false,
        error: 'Failed to get user profile'
      };
    }

    // Update or create user profile
    await prisma.userProfile.upsert({
      where: {
        userId_platform: {
          userId: profile.userId,
          platform: 'LINE'
        }
      },
      create: {
        userId: profile.userId,
        platform: 'LINE',
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
      },
      update: {
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error processing follow event:', error);
    return {
      success: false,
      error: 'Follow event processing failed'
    };
  }
}
import { LineMessageEvent, LineAccount } from '@/app/types/line';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function processUnfollowEvent(
  event: LineMessageEvent,
  _account: LineAccount
) {
  try {
    const userId = event.source.userId;

    // Update user profile status
    await prisma.userProfile.update({
      where: {
        userId_platform: {
          userId,
          platform: 'LINE'
        }
      },
      data: {
        statusMessage: 'Unfollowed'
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error processing unfollow event:', error);
    return {
      success: false,
      error: 'Unfollow event processing failed'
    };
  }
}
import { LineMessageEvent, LineAccount } from '@/app/types/line';
import { updateUserProfile } from '../../profile';
import { getLineUserProfile } from '../../profile';

export async function processFollowEvent(
  event: LineMessageEvent,
  _account: LineAccount // Prefix with underscore since it's unused
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

    // Update profile
    await updateUserProfile({
      userId: profile.userId,
      platform: 'LINE',
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage
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
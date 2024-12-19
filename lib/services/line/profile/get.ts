import { LineUserProfile } from '@/app/types/line';
import { getLineClient } from '../../lineService';

export async function getLineUserProfile(userId: string): Promise<LineUserProfile | null> {
  try {
    const client = getLineClient();
    const profile = await client.getProfile(userId);

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
import { Platform } from '@prisma/client';
import { findConversation } from './find';
import { createConversation } from './create';

export async function findOrCreateConversation(
  userId: string,
  platform: Platform,
  channelId: string,
  lineAccountId?: string | null
) {
  // First try to find existing conversation
  const existingConversation = await findConversation({
    userId,
    platform,
    lineAccountId
  });

  if (existingConversation) {
    return existingConversation;
  }

  // Create new conversation if none exists
  return createConversation({
    userId,
    platform,
    channelId,
    lineAccountId
  });
}
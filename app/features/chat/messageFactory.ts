import { Platform, SenderType } from '@prisma/client';
import { TempMessage } from '@/app/types/message';

export function createTempMessage(
  conversationId: string,
  content: string,
  platform: Platform,
  sender: SenderType = 'USER'
): TempMessage {
  return {
    id: `temp-${Date.now()}`,
    conversationId,
    content,
    sender,
    timestamp: new Date(),
    platform,
    externalId: null,
    chatType: null,
    chatId: null,
    metadata: null
  };
}
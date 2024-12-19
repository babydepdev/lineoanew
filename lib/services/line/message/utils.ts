import { LineMessageParams } from './types';
import { MessageCreateParams } from '../../message/types';

/**
 * Creates message parameters from LINE message data
 */
export function createMessageParams(
  params: LineMessageParams,
  conversationId: string
): MessageCreateParams {
  const baseParams = {
    conversationId,
    sender: 'USER',
    platform: 'LINE',
    externalId: params.messageId,
    timestamp: params.timestamp,
    chatType: params.source.type,
    chatId: getChatId(params.source)
  };

  if (params.messageType === 'image') {
    return {
      ...baseParams,
      contentType: 'image',
      content: 'Sent an image',
      contentUrl: params.contentProvider?.originalContentUrl
    };
  }

  return {
    ...baseParams,
    contentType: 'text',
    content: params.text || '',
    contentUrl: null
  };
}

/**
 * Gets the appropriate chat ID based on source type
 */
function getChatId(source: {
  type: string;
  userId: string;
  roomId?: string;
  groupId?: string;
}): string {
  switch (source.type) {
    case 'room':
      return source.roomId || source.userId;
    case 'group':
      return source.groupId || source.userId;
    default:
      return source.userId;
  }
}
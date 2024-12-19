import { 
  LineMessageParams,
  MessageCreateParams,
  TextMessageParams,
  ImageMessageParams 
} from './types';

/**
 * Creates message parameters from LINE message data
 */
export function createMessageParams(
  params: LineMessageParams,
  conversationId: string
): MessageCreateParams {
  const baseParams = {
    conversationId,
    sender: 'USER' as const,
    platform: 'LINE' as const,
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
      contentUrl: params.contentProvider?.originalContentUrl || ''
    } satisfies ImageMessageParams;
  }

  return {
    ...baseParams,
    contentType: 'text',
    content: params.text || ''
  } satisfies TextMessageParams;
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
import { Platform } from '@prisma/client';
import { findOrCreateConversation } from '../conversation';
import { createMessage } from './create';
import { broadcastConversationUpdate } from '../conversation/realtime';

interface MessageHandlerParams {
  userId: string;
  content: string;
  platform: Platform;
  messageId?: string;
  timestamp?: Date;
  lineAccountId?: string;
}

export async function handleIncomingMessage(params: MessageHandlerParams) {
  const { userId, content, platform, messageId, timestamp, lineAccountId } = params;

  try {
    // Find or create conversation
    const conversation = await findOrCreateConversation(
      userId,
      platform,
      userId,
      lineAccountId
    );

    // Create message
    const message = await createMessage({
      conversationId: conversation.id,
      content,
      sender: 'USER',
      platform,
      externalId: messageId,
      timestamp: timestamp || new Date()
    });

    // Broadcast updates
    await broadcastConversationUpdate(conversation.id);

    return { message, conversation };
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}

import { Platform, Message, Conversation } from '@prisma/client';
import { MessageCreateParams } from './message/types';
import { findOrCreateConversation } from './conversation';
import { createMessage } from './message';
import { broadcastConversationUpdate } from './conversation/broadcast';

interface WebhookResult {
  message: Message;
  conversation: Conversation;
}

export async function handleIncomingMessage(
  userId: string,
  messageText: string,
  platform: Platform,
  messageId?: string,
  timestamp?: Date
): Promise<WebhookResult> {
  try {
    console.log('Handling incoming message:', {
      userId,
      messageText,
      platform,
      messageId,
      timestamp
    });

    const messageTimestamp = timestamp || new Date();

    // Find or create conversation
    const conversation = await findOrCreateConversation(
      userId,
      platform,
      userId // Use userId as channelId for non-LINE platforms
    );

    // Create message params
    const messageParams: MessageCreateParams = {
      conversationId: conversation.id,
      content: messageText,
      sender: 'USER',
      platform,
      externalId: messageId,
      timestamp: messageTimestamp
    };

    // Create message
    const message = await createMessage(messageParams);

    // Broadcast updates
    await broadcastConversationUpdate(conversation.id);

    return { message, conversation };
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}

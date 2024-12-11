import { LineMessageParams, LineMessageResult } from './types';
import { findOrCreateConversation } from '../../conversation';
import { createMessage, broadcastMessageUpdate } from '../../message';

export async function createLineMessage(params: LineMessageParams): Promise<LineMessageResult> {
  try {
    const { userId, text, messageId, timestamp, channelId, lineAccountId } = params;

    // Validate text content
    const trimmedText = text.trim();
    if (!trimmedText) {
      return {
        success: false,
        error: 'Message text is required'
      };
    }

    // Find or create conversation
    const conversation = await findOrCreateConversation(
      userId,
      'LINE',
      channelId,
      lineAccountId
    );

    // Create message
    const message = await createMessage({
      conversationId: conversation.id,
      content: trimmedText, // Now guaranteed to be non-empty string
      sender: 'USER',
      platform: 'LINE',
      externalId: messageId,
      timestamp
    });

    // Broadcast update
    await broadcastMessageUpdate(conversation.id);

    return {
      success: true,
      messageId: message.id
    };
  } catch (error) {
    console.error('Error creating LINE message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
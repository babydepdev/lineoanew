import { MessageCreateParams, MessageCreateResult } from './types';
import { findOrCreateConversation } from '../../conversation';
import { createMessage } from '../../message';
import { broadcastMessageUpdate } from '../../message/broadcast';
import { getChatIdentifier } from '../utils/chatIdentifier';
import { validateMessageContent } from './validate/content';

export async function createLineMessage(params: MessageCreateParams): Promise<MessageCreateResult> {
  try {
    const { 
      userId, 
      text, 
      messageId, 
      timestamp,
      platform,
      lineAccountId,
      source,
      messageType = 'text'
    } = params;

    // Validate content
    const contentValidation = validateMessageContent(text);
    if (!contentValidation.isValid || !contentValidation.content) {
      return {
        success: false,
        error: contentValidation.error || 'Invalid content'
      };
    }

    // Get chat identifier
    const { chatId, chatType } = getChatIdentifier(source);

    // Find or create conversation
    const conversation = await findOrCreateConversation(
      userId,
      platform,
      chatId,
      lineAccountId
    );

    // Create message
    const message = await createMessage({
      conversationId: conversation.id,
      content: contentValidation.content,
      sender: 'USER',
      platform,
      externalId: messageId,
      timestamp,
      chatType,
      chatId,
      messageType
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
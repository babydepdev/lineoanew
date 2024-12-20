import { MessageCreateParams, MessageCreateResult } from './types';
import { findOrCreateConversation } from '../../conversation';
import { createMessage } from '../../message';
import { broadcastMessageUpdate } from '../../message/broadcast';
import { getChatIdentifier } from '../utils/chatIdentifier';
import { validateMessageContent } from './validate/content';
import { getImageBase64 } from '../image/base64';
import { getLineClient } from '../client/instance';
import { isImageContent } from '../image/content';
import { broadcastAllConversations } from '@/lib/services/conversation/broadcast';

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

    // Handle image message
    let imageBase64: string | undefined;
    if (messageType === 'image' && isImageContent(contentValidation.content)) {
      try {
        const client = await getLineClient();
        imageBase64 = await getImageBase64(client, messageId);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

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
      messageType,
      imageBase64
    });

    // Broadcast updates
    await Promise.all([
      broadcastMessageUpdate(conversation.id),
      broadcastAllConversations()
    ]);

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
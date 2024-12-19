import { MessageCreateParams } from '../../message/types';
import { MessageCreateResult } from '../../lineService';
import { LineMessageCreateParams } from './types/params';
import { findOrCreateConversation } from '../../conversation';
import { createMessage } from '../../message';
import { broadcastMessageUpdate } from '../../message/broadcast';
import { getChatIdentifier } from '../utils/chatIdentifier';
import { validateMessageContent } from './validate/content';
import { processLineImage } from '../image/process';
import { clientManager } from '../client/manager';

export async function createLineMessage(params: LineMessageCreateParams): Promise<MessageCreateResult> {
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
    let imageBase64: string | null = null;
    if (messageType === 'image') {
      try {
        const client = clientManager.getClient();
        const result = await processLineImage(client, messageId);
        if (result.success && result.base64) {
          imageBase64 = result.base64;
        }
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    // Create message params
    const messageParams: MessageCreateParams = {
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
    };

    // Create message
    const message = await createMessage(messageParams);

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
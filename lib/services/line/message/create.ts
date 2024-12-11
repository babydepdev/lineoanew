import { LineMessageParams, LineMessageResult } from './types';
import { findOrCreateConversation } from '../../conversation';
import { createMessage, broadcastMessageUpdate } from '../../message';
import { getChatIdentifier } from '../utils/chatIdentifier';
import { MessageCreateParams } from '../../message/types';

export async function createLineMessage(params: LineMessageParams): Promise<LineMessageResult> {
  try {
    const { 
      userId, 
      text, 
      messageId, 
      timestamp, 
      lineAccountId,
      source,
      botId // Add botId parameter
    } = params;

    // Validate text content
    const trimmedText = text.trim();
    if (!trimmedText) {
      return {
        success: false,
        error: 'Message text is required'
      };
    }

    // Get chat identifier based on source type
    const { chatId, chatType } = getChatIdentifier(source);
    
    // Find or create conversation with unique chat identifier
    const conversation = await findOrCreateConversation(
      userId,
      'LINE',
      chatId,
      lineAccountId
    );

    // Create message params
    const messageParams: MessageCreateParams = {
      conversationId: conversation.id,
      content: trimmedText,
      sender: 'USER',
      platform: 'LINE',
      externalId: messageId,
      timestamp,
      chatType,
      chatId,
      botId // Pass the botId
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
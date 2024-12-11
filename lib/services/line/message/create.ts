import { LineMessageParams, LineMessageResult } from './types';
import { findOrCreateConversation } from '../../conversation';
import { createMessage } from '../../message';
import { broadcastMessageUpdate } from '../../message/broadcast';
import { getChatIdentifier } from '../utils/chatIdentifier';

export async function createLineMessage(params: LineMessageParams): Promise<LineMessageResult> {
  try {
    const { 
      userId, 
      text, 
      messageId, 
      timestamp, 
      lineAccountId,
      source 
    } = params;

    // Get chat identifier based on source type
    const { chatId, chatType } = getChatIdentifier(source);
    
    // Find or create conversation with unique chat identifier
    const conversation = await findOrCreateConversation(
      userId,
      'LINE',
      chatId,
      lineAccountId
    );

    // Check for existing message
    const message = await createMessage({
      conversationId: conversation.id,
      content: text,
      sender: 'USER',
      platform: 'LINE',
      externalId: messageId,
      timestamp,
      chatType,
      chatId
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
import { PrismaClient } from '@prisma/client';
import { CreateLineMessageParams, CreateLineMessageResult } from './types/createMessage';
import { findOrCreateConversation } from '../../conversation';
import { createMessage } from './repository';
import { broadcastMessageUpdate } from '../../message/broadcast';
import { getChatIdentifier } from '../utils/chatIdentifier';
import { MessageCreateParams } from './types/messageTypes';

const prisma = new PrismaClient();

export async function createLineMessage(params: CreateLineMessageParams): Promise<CreateLineMessageResult> {
  try {
    const { 
      userId, 
      text, 
      messageId, 
      timestamp, 
      lineAccountId,
      source,
      replyToken 
    } = params;

    // Validate text content
    const trimmedText = text.trim();
    if (!trimmedText) {
      return {
        success: false,
        error: 'Message text is required'
      };
    }

    // Check if message already exists
    const existingMessage = await prisma.message.findUnique({
      where: { externalId: messageId }
    });

    if (existingMessage) {
      console.log('Message already exists, skipping creation:', messageId);
      return {
        success: true,
        messageId: existingMessage.id,
        replyToken
      };
    }

    // Get chat identifier based on source type
    const { chatId, chatType } = getChatIdentifier(source);
    
    // Find or create conversation
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
      timestamp,
      externalId: messageId,
      chatType,
      chatId,
      metadata: replyToken ? { replyToken } : null
    };

    // Create message
    const message = await createMessage(messageParams);

    // Broadcast update
    await broadcastMessageUpdate(conversation.id);

    console.log('Created LINE message with reply token:', {
      messageId: message.id,
      replyToken: replyToken || 'none'
    });

    return {
      success: true,
      messageId: message.id,
      replyToken
    };
  } catch (error) {
    console.error('Error creating LINE message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
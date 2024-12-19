import { PrismaClient } from '@prisma/client';
import { LineMessageParams, LineMessageResult } from './types';
import { findOrCreateConversation } from '../../conversation';
import { createMessage } from '../../message';
import { broadcastMessageUpdate } from '../../message/broadcast';
import { createMessageParams } from './utils';
import { validateMessageParams } from './validation';

const prisma = new PrismaClient();

/**
 * Creates a new LINE message and broadcasts updates
 */
export async function createLineMessage(params: LineMessageParams): Promise<LineMessageResult> {
  try {
    // Validate message parameters
    const validationResult = validateMessageParams(params);
    if (!validationResult.isValid) {
      return {
        success: false,
        error: validationResult.error
      };
    }

    // Check for existing message
    const existingMessage = await prisma.message.findUnique({
      where: { externalId: params.messageId }
    });

    if (existingMessage) {
      return {
        success: true,
        messageId: existingMessage.id
      };
    }

    // Find or create conversation
    const conversation = await findOrCreateConversation(
      params.userId,
      'LINE',
      params.channelId,
      params.lineAccountId
    );

    // Create message with proper parameters
    const messageParams = createMessageParams(params, conversation.id);
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
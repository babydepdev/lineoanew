import { PrismaClient } from '@prisma/client';
import { LineMessageParams, LineMessageResult } from './types';
import { findOrCreateConversation } from '../../conversation';

import { broadcastMessageUpdate } from '../../message/broadcast';
import { getChatIdentifier } from '../utils/chatIdentifier';

const prisma = new PrismaClient();

export async function createLineMessage(params: LineMessageParams): Promise<LineMessageResult> {
  try {
    // Extract chat identifier
    const { chatId, chatType } = getChatIdentifier(params.source);

    // Find or create conversation
    const conversation = await findOrCreateConversation(
      params.userId,
      'LINE',
      chatId,
      params.lineAccountId
    );

    // Create message with transaction
    const message = await prisma.$transaction(async (tx) => {
      // Check for existing message
      const existing = await tx.message.findUnique({
        where: { externalId: params.messageId }
      });

      if (existing) {
        return existing;
      }

      return tx.message.create({
        data: {
          conversationId: conversation.id,
          content: params.text,
          sender: 'USER',
          platform: 'LINE',
          externalId: params.messageId,
          timestamp: params.timestamp,
          chatType,
          chatId
        }
      });
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
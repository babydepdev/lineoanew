import { PrismaClient } from '@prisma/client';
import { MessageParams, MessageResult } from './types/base';

const prisma = new PrismaClient();

export async function createLineMessage(params: MessageParams): Promise<MessageResult> {
  try {
    // Format content based on message type
    const content = params.messageType === 'text' 
      ? params.text
      : JSON.stringify({
          type: 'image',
          originalUrl: params.imageContent.originalUrl,
          previewUrl: params.imageContent.previewUrl
        });

    // Create message in database
    const message = await prisma.message.create({
      data: {
        conversationId: params.channelId,
        content,
        sender: 'USER',
        platform: params.platform,
        externalId: params.messageId,
        timestamp: params.timestamp,
        chatType: params.source.type,
        chatId: `${params.source.type}_${params.userId}`
      }
    });

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
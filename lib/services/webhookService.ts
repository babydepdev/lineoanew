import { PrismaClient } from '@prisma/client';
import { broadcastConversationUpdate } from './messageService';
import { findOrCreateConversation } from './conversationService';
import { createMessage } from './messageService';

const prisma = new PrismaClient();

export async function handleIncomingMessage(
  userId: string,
  messageText: string,
  platform: 'LINE' | 'FACEBOOK',
  messageId?: string,
  timestamp?: Date
) {
  try {
    console.log('Handling incoming message:', {
      userId,
      messageText,
      platform,
      messageId,
      timestamp
    });

    const messageTimestamp = timestamp || new Date();
    const conversation = await findOrCreateConversation(userId, platform);
    
    const message = await createMessage(
      conversation.id,
      messageText,
      'USER',
      platform,
      messageId,
      messageTimestamp
    );

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: messageTimestamp }
    });

    await broadcastConversationUpdate(conversation.id);
    console.log('Message broadcast complete');

    return { message, conversationId: conversation.id };
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}
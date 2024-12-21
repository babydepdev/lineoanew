import { Platform } from '@prisma/client';
import { findOrCreateConversation } from '../conversation';
import { createMessage } from './create';
import { broadcastConversationUpdate } from '../conversation/realtime';
import { getLineClient } from '../line/client/instance';
import { getImageBase64 } from '../line/image/base64';
import { isImageContent } from '../line/image/content';

interface MessageHandlerParams {
  userId: string;
  content: string;
  platform: Platform;
  messageId?: string;
  timestamp?: Date;
  lineAccountId?: string;
  messageType?: 'text' | 'image';
}

export async function handleIncomingMessage(params: MessageHandlerParams) {
  const { 
    userId, 
    content, 
    platform, 
    messageId, 
    timestamp, 
    lineAccountId,
    messageType 
  } = params;

  try {
    // Find or create conversation
    const conversation = await findOrCreateConversation(
      userId,
      platform,
      userId,
      lineAccountId
    );

    // Handle image content
    let imageBase64: string | undefined;
    if (messageType === 'image' && isImageContent(content)) {
      try {
        const client = await getLineClient();
        imageBase64 = await getImageBase64(client, messageId || '');
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    // Create message
    const message = await createMessage({
      conversationId: conversation.id,
      content,
      sender: 'USER',
      platform,
      externalId: messageId,
      timestamp: timestamp || new Date(),
      messageType,
      imageBase64
    });

    // Broadcast updates
    await broadcastConversationUpdate(conversation.id);

    return { message, conversation };
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}
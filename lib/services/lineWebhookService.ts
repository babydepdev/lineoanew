import { LineMessageEvent, LineAccount } from '@/app/types/line';
import { MessageCreateParams } from './message/types';
import { findOrCreateConversation } from './conversation';
import { createMessage, broadcastMessageUpdate } from './message';

export async function handleLineWebhookEvent(
  event: LineMessageEvent, 
  lineAccount: LineAccount
) {
  try {
    if (event.type !== 'message' || event.message.type !== 'text') {
      console.log('Skipping non-text message event:', {
        type: event.type,
        messageType: event.message.type
      });
      return null;
    }

    const userId = event.source.userId;
    const text = event.message.text || '';
    const messageId = event.message.id;
    const timestamp = new Date(event.timestamp);
    const channelId = event.source.roomId || event.source.groupId || userId;

    // Find or create conversation
    const conversation = await findOrCreateConversation(
      userId,
      'LINE',
      channelId,
      lineAccount.id
    );

    // Create message params
    const messageParams: MessageCreateParams = {
      conversationId: conversation.id,
      content: text,
      sender: 'USER',
      platform: 'LINE',
      externalId: messageId,
      timestamp
    };

    // Create message
    const message = await createMessage(messageParams);

    // Broadcast update
    await broadcastMessageUpdate(conversation.id);

    return message;
  } catch (error) {
    console.error('Error handling LINE webhook event:', error);
    throw error;
  }
}
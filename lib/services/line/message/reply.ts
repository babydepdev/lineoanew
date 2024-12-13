import { MessageResult, ReplyMessageOptions } from './types/messageTypes';
import { createTextMessage } from './types/messages';
import { getLineClient } from './client';

export async function sendReplyMessage(options: ReplyMessageOptions): Promise<MessageResult> {
  const { replyToken, content, lineAccountId } = options;

  try {
    // Get LINE client
    const client = await getLineClient(lineAccountId);
    if (!client) {
      return {
        success: false,
        error: 'Failed to initialize LINE client'
      };
    }

    // Create message
    const message = createTextMessage(content);

    console.log('Sending LINE reply message:', {
      replyToken: replyToken.substring(0, 8) + '...',
      contentPreview: content.substring(0, 50) + (content.length > 50 ? '...' : '')
    });

    // Send reply message
    await client.replyMessage(replyToken, message);

    console.log('LINE reply message sent successfully');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending LINE reply message:', error);
    return {
      success: false,
      error: `Failed to send reply message: ${errorMessage}`
    };
  }
}
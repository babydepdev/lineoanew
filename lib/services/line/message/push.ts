import { MessageResult, PushMessageOptions } from './types/index';
import { createTextMessage } from './types/messages';
import { getLineClient } from './client';

export async function sendPushMessage(options: PushMessageOptions): Promise<MessageResult> {
  const { userId, content, lineAccountId } = options;

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

    console.log('Sending LINE push message:', {
      userId,
      content: content.substring(0, 50) + (content.length > 50 ? '...' : '')
    });

    // Send push message
    await client.pushMessage(userId, message);

    console.log('LINE push message sent successfully');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending LINE push message:', error);
    return {
      success: false,
      error: `Failed to send push message: ${errorMessage}`
    };
  }
}
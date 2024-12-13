import { MessageResult, ReplyMessageOptions } from './types/messageTypes';
import { createTextMessage } from './types/messages';
import { getLineClient } from './client';
import { validateReplyToken } from './validators/replyToken';
import { replyTokenStore } from './replyTokenStore';

export async function sendReplyMessage(options: ReplyMessageOptions): Promise<MessageResult> {
  const { replyToken, content, timestamp, lineAccountId } = options;

  try {
    // Validate reply token
    const validation = validateReplyToken(replyToken, timestamp);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Cannot use reply token: ${validation.reason}`
      };
    }

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
      contentPreview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      remainingTime: `${Math.round(validation.remainingTime / 1000)}s`
    });

    // Send reply message
    await client.replyMessage(replyToken, message);

    // Mark token as used
    replyTokenStore.markAsUsed(replyToken);

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
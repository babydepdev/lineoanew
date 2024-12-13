import { MessageResult, ReplyMessageOptions } from './index';
import { createTextMessage } from './types/messages';
import { getLineClient } from './client';
import { validateReplyToken } from '../utils/replyToken';

export async function sendReplyMessage(options: ReplyMessageOptions): Promise<MessageResult> {
  const { replyToken, content, timestamp, lineAccountId } = options;

  try {
    // Validate reply token
    const tokenInfo = validateReplyToken(replyToken, timestamp);
    
    if (!tokenInfo.isValid) {
      return {
        success: false,
        error: `Reply token expired or invalid (Expired at: ${new Date(tokenInfo.expiresAt).toISOString()})`
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
      replyToken,
      contentPreview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      expiresIn: tokenInfo.expiresAt - Date.now()
    });

    // Send reply
    await client.replyMessage(replyToken, message);

    console.log('LINE reply message sent trply successfully');
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
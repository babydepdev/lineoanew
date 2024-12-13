import { Client } from '@line/bot-sdk';
import { MessageResult,ReplyMessageOptions } from './types'
import { validateReplyToken, formatExpiryTime } from '../utils/
import { createTextMessage } from './types/messages';
import { getLineClient } from './client';
import { DEFAULT_REPLY_CONFIG } from './types/reply';

export async function sendReplyMessage(options: ReplyMessageOptions): Promise<MessageResult> {
  const { replyToken, content, timestamp, lineAccountId } = options;

  try {
    // Validate reply token
    const tokenInfo = validateReplyToken(replyToken, timestamp);
    
    if (!tokenInfo.isValid) {
      console.log('Reply token validation failed:', {
        token: replyToken,
        expiresAt: formatExpiryTime(tokenInfo.expiresAt)
      });
      return {
        success: false,
        error: `Reply token expired or invalid. Expired at: ${new Date(tokenInfo.expiresAt).toISOString()}`
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
      content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      expiresIn: formatExpiryTime(tokenInfo.expiresAt)
    });

    // Send reply
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
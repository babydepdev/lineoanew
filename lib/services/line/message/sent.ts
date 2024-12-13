import { MessageResult, PushMessageOptions, ReplyMessageOptions } from './types/messageTypes';
import { sendReplyMessage } from './reply';
import { sendPushMessage } from './push';
import { validateReplyToken } from './validators/replyToken';
import { replyTokenStore } from './replyTokenStore';

export async function sendLineMessage(
  userId: string,
  content: string,
  replyToken?: string | null,
  timestamp?: number | null,
  lineAccountId?: string | null
): Promise<MessageResult> {
  try {
    // Try to use reply message if token is available
    if (replyToken && timestamp) {
      const validation = validateReplyToken(replyToken, timestamp);
      
      if (validation.isValid) {
        console.log('Attempting reply message:', {
          remainingTime: `${Math.round(validation.remainingTime / 1000)}s`,
          expiresAt: new Date(validation.expiresAt).toISOString()
        });

        const replyOptions: ReplyMessageOptions = {
          replyToken,
          content,
          timestamp,
          lineAccountId
        };

        try {
          const replyResult = await sendReplyMessage(replyOptions);
          if (replyResult.success) {
            return replyResult;
          }
          console.warn('Reply message failed:', replyResult.error);
        } catch (error) {
          console.error('Error sending reply message:', error);
        }
      } else {
        console.log('Cannot use reply token:', validation.reason);
      }
    }

    // Fall back to push message
    console.log('Using push message as fallback');
    const pushOptions: PushMessageOptions = {
      userId,
      content,
      lineAccountId
    };

    return await sendPushMessage(pushOptions);
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Store reply token when webhook is received
export function storeReplyToken(token: string, timestamp: number): void {
  replyTokenStore.set(token, {
    token,
    timestamp,
    used: false
  });
}
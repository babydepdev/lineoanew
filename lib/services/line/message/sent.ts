import  { MessageResult, PushMessageOptions, ReplyMessageOptions }  from './index';
import { sendReplyMessage } from './reply';
import { sendPushMessage } from './push';
import { validateReplyToken } from '../utils/replyToken';
import { DEFAULT_REPLY_CONFIG } from './types/reply';

export async function sendLineMessage(
  userId: string,
  content: string,
  replyToken?: string,
  timestamp?: number,
  lineAccountId?: string | null
): Promise<MessageResult> {
  try {
    // Try reply message first if token available
    if (replyToken && timestamp) {
      const tokenInfo = validateReplyToken(replyToken, timestamp);
      
      if (tokenInfo.isValid) {
        console.log('Using reply message with valid token');
        
        const replyOptions: ReplyMessageOptions = {
          replyToken,
          content,
          timestamp,
          lineAccountId
        };

        const replyResult = await sendReplyMessage(replyOptions);
        
        // Return success if reply worked
        if (replyResult.success) {
          return replyResult;
        }

        // Only fall back to push if configured
        if (!DEFAULT_REPLY_CONFIG.fallbackToPush) {
          return replyResult;
        }

        console.log('Reply failed, falling back to push message');
      } else {
        console.log('Reply token expired, using push message');
      }
    }

    // Fall back to push message
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
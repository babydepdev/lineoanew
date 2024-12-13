import { MessageResult, PushMessageOptions, ReplyMessageOptions } from './types/messageTypes';
import { sendReplyMessage } from './reply';
import { sendPushMessage } from './push';


const REPLY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes in milliseconds

export async function sendLineMessage(
  userId: string,
  content: string,
  replyToken?: string | null,
  timestamp?: number | null,
  lineAccountId?: string | null
): Promise<MessageResult> {
  try {
    // Check if we can use reply message
    if (replyToken && timestamp) {
      const now = Date.now();
      const messageAge = now - timestamp;
      
      // Only use reply if within expiry window
      if (messageAge < REPLY_TOKEN_EXPIRY) {
        console.log('Using reply message - token still valid:', {
          messageAge: `${messageAge / 1000}s`,
          expiryIn: `${(REPLY_TOKEN_EXPIRY - messageAge) / 1000}s`
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
            console.log('Reply message sent successfully');
            return replyResult;
          }
          console.warn('Reply message failed, falling back to push:', replyResult.error);
        } catch (error) {
          console.error('Error sending reply message:', error);
        }
      } else {
        console.log('Reply token expired:', {
          messageAge: `${messageAge / 1000}s`,
          maxAge: `${REPLY_TOKEN_EXPIRY / 1000}s`
        });
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
 
import { SendMessageResult } from './types';
import LineClientManager from '../client';
import { findLineAccountById } from '../account';
import { createTextMessage } from './types/messages';
import { sendLineReplyMessage } from './reply';

export async function sendLineMessage(
  userId: string, 
  content: string,
  replyToken?: string,
  timestamp?: number,
  lineAccountId?: string | null
): Promise<SendMessageResult> {
  try {
    // Try to use reply token if available and valid
    if (replyToken && timestamp) {
      const replyResult = await sendLineReplyMessage(
        replyToken,
        content,
        timestamp,
        lineAccountId
      );

      if (replyResult.success) {
        return replyResult;
      }

      // If reply failed but not due to expiry, return the error
      if (replyResult.error !== 'Reply token expired') {
        return replyResult;
      }

      // Otherwise fall through to push message
      console.log('Falling back to push message after reply token expiry');
    }

    console.log('Preparing to send LINE push message:', { 
      userId, 
      content, 
      lineAccountId 
    });

    // Get LINE account
    const account = lineAccountId ? 
      await findLineAccountById(lineAccountId) :
      await findDefaultLineAccount();

    if (!account) {
      console.error('No valid LINE account found');
      return {
        success: false,
        error: 'No valid LINE account configuration found'
      };
    }

    // Get client for this account
    const client = LineClientManager.getClient(account);

    // Validate message content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return {
        success: false,
        error: 'Message content cannot be empty'
      };
    }

    // Create properly typed message
    const message = createTextMessage(trimmedContent);

    console.log('Sending LINE push message with account:', {
      accountId: account.id,
      accountName: account.name,
      userId
    });

    // Send push message
    await client.pushMessage(userId, message);

    console.log('LINE push message sent successfully');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending LINE message:', error);
    return {
      success: false,
      error: `Failed to send LINE message: ${errorMessage}`
    };
  }
}

async function findDefaultLineAccount() {
  try {
    // Get first active account
    const account = await findLineAccountById(process.env.DEFAULT_LINE_ACCOUNT_ID || '');
    if (account) return account;

    // Fallback to environment variables
    if (process.env.LINE_CHANNEL_ACCESS_TOKEN && process.env.LINE_CHANNEL_SECRET) {
      return {
        id: 'default',
        name: 'Default Account',
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
        channelSecret: process.env.LINE_CHANNEL_SECRET,
        active: true
      };
    }

    return null;
  } catch (error) {
    console.error('Error finding default LINE account:', error);
    return null;
  }
}
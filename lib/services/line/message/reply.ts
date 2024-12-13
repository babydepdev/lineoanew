
import { SendMessageResult } from './types';
import { createTextMessage } from './types/messages';
import LineClientManager from '../client';
import { findLineAccountById } from '../account';

const REPLY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes in milliseconds

export async function sendLineReplyMessage(
  replyToken: string,
  content: string,
  timestamp: number,
  lineAccountId?: string | null
): Promise<SendMessageResult> {
  try {
    console.log('Preparing to send LINE reply message:', { 
      replyToken, 
      content,
      timestamp,
      lineAccountId 
    });

    // Check reply token expiry
    if (!isReplyTokenValid(timestamp)) {
      console.log('Reply token expired, falling back to push message');
      return {
        success: false,
        error: 'Reply token expired'
      };
    }

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

    console.log('Sending LINE reply message with account:', {
      accountId: account.id,
      accountName: account.name,
      replyToken
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
      error: `Failed to send LINE reply message: ${errorMessage}`
    };
  }
}

function isReplyTokenValid(timestamp: number): boolean {
  const now = Date.now();
  const messageAge = now - timestamp;
  return messageAge < REPLY_TOKEN_EXPIRY;
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
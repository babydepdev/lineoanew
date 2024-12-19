import { getLineClient } from '../../lineService';
import { MessageSendResult } from './types';
import { findLineAccountById } from '../account';

export async function sendLineMessage(
  userId: string, 
  content: string,
  lineAccountId?: string | null
): Promise<MessageSendResult> {
  try {
    console.log('Preparing to send LINE message:', { 
      userId, 
      content, 
      lineAccountId 
    });

    // Get LINE account if ID provided
    let client = getLineClient();
    if (lineAccountId) {
      const account = await findLineAccountById(lineAccountId);
      if (!account) {
        return {
          success: false,
          error: 'LINE account not found'
        };
      }
      client = getLineClient(account);
    }

    // Send message
    await client.pushMessage(userId, {
      type: 'text',
      text: content
    });

    console.log('LINE message sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message'
    };
  }
}
import { Client } from '@line/bot-sdk';
import { MessageSendResult } from './types';
import { findLineAccountById } from '../account';
import { createTextMessage } from './types/messages';
import { validateMessageContent } from './validate/content';
import { clientManager } from '../client/manager';


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

    // Validate content
    const validation = validateMessageContent(content);
    if (!validation.isValid || !validation.content) {
      return {
        success: false,
        error: validation.error || 'Invalid message content'
      };
    }

    // Get LINE account and client
    let client: Client;
    if (lineAccountId) {
      const account = await findLineAccountById(lineAccountId);
      if (!account) {
        return {
          success: false,
          error: 'LINE account not found'
        };
      }
      client = clientManager.getClient(account);
    } else {
      client = clientManager.getClient();
    }

    // Create message
    const message = createTextMessage(validation.content);

    // Send message
    await client.pushMessage(userId, message);

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
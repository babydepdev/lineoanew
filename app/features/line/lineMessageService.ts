import { sendLineMessage } from '@/lib/lineClient';
import { findOrCreateConversation, updateConversationTimestamp } from '@/lib/services/conversationService';
import { createMessage, broadcastConversationUpdate } from '@/lib/services/messageService';

export async function sendLineMessageToUser(userId: string, content: string): Promise<boolean> {
  return sendLineMessage(userId, content);
}

export async function handleLineMessageReceived(
  userId: string, 
  content: string, 
  messageId: string, 
  timestamp: Date
) {
  try {
    const conversation = await findOrCreateConversation(userId, 'LINE');
    
    const message = await createMessage(
      conversation.id,
      content,
      'USER',
      'LINE',
      messageId,
      timestamp
    );

    await updateConversationTimestamp(conversation.id, timestamp);
    await broadcastConversationUpdate(conversation.id);

    return message;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}
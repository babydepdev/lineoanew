import axios from 'axios';
import { handleIncomingMessage } from './webhookHandlers';

const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v17.0/me/messages';
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

interface FacebookWebhookEntry {
  id: string;
  messaging: Array<{
    sender: {
      id: string;
    };
    message: {
      text: string;
      mid: string;
      timestamp: number;
    };
  }>;
}

interface FacebookWebhookBody {
  object: string;
  entry: FacebookWebhookEntry[];
}

export async function handleFacebookWebhook(body: FacebookWebhookBody) {
  if (body.object === 'page') {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      if (webhookEvent?.message?.text) {
        await handleIncomingMessage(
          webhookEvent.sender.id,
          webhookEvent.message.text,
          'FACEBOOK',
          webhookEvent.message.mid,
          new Date(webhookEvent.message.timestamp)
        );
      }
    }
  }
}

export async function sendFacebookMessage(recipientId: string, messageText: string): Promise<boolean> {
  if (!recipientId || !messageText || !PAGE_ACCESS_TOKEN) {
    console.error('Missing required parameters for Facebook message');
    return false;
  }

  try {
    await axios.post(
      FACEBOOK_GRAPH_API,
      {
        recipient: { id: recipientId },
        message: { text: messageText }
      },
      {
        params: { access_token: PAGE_ACCESS_TOKEN },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return true;
  } catch (error) {
    console.error('Error sending Facebook message:', error);
    return false;
  }
}
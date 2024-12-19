export interface LineTextMessage {
    type: 'text';
    text: string;
    emojis?: Array<{
      index: number;
      productId: string;
      emojiId: string;
    }>;
  }
  
  export function validateTextMessage(message: unknown): message is LineTextMessage {
    if (!message || typeof message !== 'object') return false;
    
    const msg = message as Record<string, unknown>;
    
    return (
      msg.type === 'text' &&
      typeof msg.text === 'string' &&
      (!msg.emojis || Array.isArray(msg.emojis))
    );
  }
  
  export function createTextMessage(text: string): LineTextMessage {
    return {
      type: 'text',
      text: text.trim()
    };
  }
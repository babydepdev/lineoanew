export interface LineImageMessage {
    type: 'image';
    id: string;
    contentProvider: {
      type: 'line' | 'external';
      originalContentUrl?: string;
      previewImageUrl?: string;
    };
  }
  
  export interface LineImageContent {
    type: 'image';
    originalUrl?: string;
    previewUrl?: string;
  }
  
  export function validateImageMessage(message: unknown): message is LineImageMessage {
    if (!message || typeof message !== 'object') return false;
    
    const msg = message as Record<string, unknown>;
    const provider = msg.contentProvider as Record<string, unknown>;
    
    return (
      msg.type === 'image' &&
      typeof msg.id === 'string' &&
      provider &&
      typeof provider === 'object' &&
      (provider.type === 'line' || provider.type === 'external') &&
      (provider.originalContentUrl === undefined || typeof provider.originalContentUrl === 'string') &&
      (provider.previewImageUrl === undefined || typeof provider.previewImageUrl === 'string')
    );
  }
  
  export function parseImageMessage(message: LineImageMessage): LineImageContent {
    return {
      type: 'image',
      originalUrl: message.contentProvider?.originalContentUrl,
      previewUrl: message.contentProvider?.previewImageUrl
    };
  }
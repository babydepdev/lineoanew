export const REPLY_TOKEN_LIMITS = {
    // Reply tokens must be used within 1 minute
    REPLY_WINDOW: 60 * 1000, // 1 minute in milliseconds
    // Maximum age of 20 minutes from event occurrence
    MAX_AGE: 20 * 60 * 1000, // 20 minutes in milliseconds
  } as const;
  
  export const MESSAGE_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    FILE: 'file',
    LOCATION: 'location',
    STICKER: 'sticker'
  } as const;
export const PUSHER_EVENTS = {
    MESSAGE_RECEIVED: 'message-received',
    CONVERSATION_UPDATED: 'conversation-updated',
    CONVERSATIONS_UPDATED: 'conversations-updated',
    TYPING_START: 'typing-start',
    TYPING_END: 'typing-end',
    CLIENT_TYPING: 'client-typing',
  } as const;
  
  export const PUSHER_CHANNELS = {
    CHAT: 'private-chat',
    CONVERSATION: 'private-conversation',
    CLIENT: 'private-client-events',
  } as const;
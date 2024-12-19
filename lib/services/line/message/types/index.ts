// Re-export all message-related types
export * from './messages';
export * from './params';
export * from './results';


// Core message types
export interface MessageBase {
  type: string;
  messageId: string;
}

// Message results
export interface MessageCreateResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MessageSendResult {
  success: boolean;
  error?: string;
}

// Message validation
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
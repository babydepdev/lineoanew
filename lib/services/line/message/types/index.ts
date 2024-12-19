// Re-export all message-related types
export * from './messages';
export * from './params';
export * from './results';
export * from './validation';

// Core message types
export interface MessageBase {
  type: string;
  messageId: string;
}

// Message validation
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

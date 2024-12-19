export interface MessageCreateResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MessageSendResult {
  success: boolean;
  error?: string;
}

export interface MessageValidationResult {
  isValid: boolean;
  error?: string;
  text?: string;
  messageType?: 'text' | 'image';
}
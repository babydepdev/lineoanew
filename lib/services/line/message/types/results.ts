// Message creation results
export interface MessageCreateResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MessageSendResult {
  success: boolean;
  error?: string;
}

export interface MessageProcessResult {
  success: boolean;
  error?: string;
}
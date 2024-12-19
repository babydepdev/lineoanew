export interface MessageCreateResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MessageSendResult {
  success: boolean;
  error?: string;
}
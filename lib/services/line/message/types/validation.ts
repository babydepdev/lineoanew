export interface MessageValidationResult {
  isValid: boolean;
  error?: string;
  text?: string;
  messageType?: 'text' | 'image';
}

export interface ContentValidationResult {
  isValid: boolean;
  content?: string;
  error?: string;
}

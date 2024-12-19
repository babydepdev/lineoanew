export interface LineImageMetadata {
    messageId: string;
    contentType?: string;
    contentLength?: number;
  }
  
  export interface ImageProcessingResult {
    success: boolean;
    url: string;
    error?: string;
  }
  
  export interface ImageValidationResult {
    isValid: boolean;
    error?: string;
    metadata?: LineImageMetadata;
  }
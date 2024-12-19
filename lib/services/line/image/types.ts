import { Readable } from 'stream';
import { MessageAPIResponseBase } from '@line/bot-sdk';

// Response types
export interface LineImageResponse extends MessageAPIResponseBase {
  headers: {
    'content-type'?: string;
    'content-length'?: string;
  };
}

// Stream with headers
export interface LineImageStream extends Readable {
  headers: {
    'content-type'?: string;
    'content-length'?: string;
  };
}

// Validation types
export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  metadata?: {
    messageId: string;
    contentType?: string;
    contentLength?: number;
  };
}

// Processing result
export interface ImageProcessingResult {
  success: boolean;
  buffer?: Buffer;
  contentType?: string;
  error?: string;
}
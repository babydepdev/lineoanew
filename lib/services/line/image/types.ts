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

// Image metadata
export interface LineImageMetadata {
  messageId: string;
  contentType?: string;
  contentLength?: number;
  base64?: string;
}

// Validation types
export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  metadata?: LineImageMetadata;
}

// Processing result
export interface ImageProcessingResult {
  success: boolean;
  base64?: string;
  contentType?: string;
  error?: string;
}

// Content types
export interface ImageContent {
  type: 'image';
  url: string;
  messageId: string;
  base64?: string;
}
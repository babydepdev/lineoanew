import { Readable } from 'stream';
import { MessageAPIResponseBase } from '@line/bot-sdk';

// Core types for LINE API responses
export interface LineImageHeaders {
  'content-type'?: string;
  'content-length'?: string;
}

export interface LineImageResponse extends MessageAPIResponseBase {
  headers: LineImageHeaders;
}

// Extended stream type with headers
export interface LineImageStream extends Readable {
  headers: LineImageHeaders;
}

// Metadata types
export interface LineImageMetadata {
  messageId: string;
  contentType?: string;
  contentLength?: number;
}

// Result types
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
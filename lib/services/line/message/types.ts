
import { LineSource } from '@/app/types/line';
import { Platform, SenderType } from '@prisma/client';


export interface LineMessageParams {
  userId: string;
  text?: string;
  messageType: 'text' | 'image';
  contentProvider?: {
    type: string;
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
  messageId: string;
  timestamp: Date;
  channelId: string;
  platform: Platform;
  lineAccountId?: string | null;
  source: LineSource;
}

export interface LineMessageValidationResult {
  isValid: boolean;
  error?: string;
  messageType?: 'text' | 'image';
  text?: string;
  contentProvider?: {
    type: string;
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
}
export interface MessageCreateParams {
  conversationId: string;
  content: string;
  contentType?: string;
  contentUrl?: string;
  sender: SenderType;
  platform: Platform;
  externalId?: string | null;
  timestamp?: Date;
  chatType?: string;
  chatId?: string;
}

// Rest of the file remains the same
import { Platform } from '@prisma/client';
import { LineSource } from '@/app/types/line';

export interface CreateLineMessageParams {
  userId: string;
  text: string;
  messageId: string;
  timestamp: Date;
  channelId: string;
  platform: Platform;
  lineAccountId?: string | null;
  source: LineSource;
  replyToken?: string; // Add replyToken to params
}

export interface CreateLineMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
  replyToken?: string; // Add replyToken to result
}
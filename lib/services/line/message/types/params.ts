import { Platform } from '@prisma/client';
import { LineSource } from '@/app/types/line';

export interface MessageCreateParams {
  userId: string;
  text: string;
  messageId: string;
  timestamp: Date;
  platform: Platform;
  lineAccountId?: string | null;
  source: LineSource;
  messageType?: 'text' | 'image';
  channelId?: string; // Make channelId optional
}
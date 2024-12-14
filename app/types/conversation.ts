import { Platform } from '@prisma/client';
import { LineAccount } from './line';

export interface ConversationMetadata {
  lineAccountId?: string | null;
}

export interface ConversationBase {
  id: string;
  platform: Platform;
  channelId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: ConversationMetadata;
}

export interface ConversationWithLineAccount extends ConversationBase {
  platform: 'LINE';
  lineAccount?: LineAccount | null;
  lineAccountId: string;
}

export interface ConversationWithoutLineAccount extends ConversationBase {
  platform: 'FACEBOOK';
  lineAccount?: never;
  lineAccountId?: never;
}

export type Conversation = ConversationWithLineAccount | ConversationWithoutLineAccount;
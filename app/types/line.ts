import { Platform } from '@prisma/client';

export interface LineMessageEvent {
  type: string;
  message: {
    type: string;
    text: string;
    id: string;
  };
  source: {
    type: string;
    userId: string;
    roomId?: string;
    groupId?: string;
  };
  replyToken: string;
  timestamp: number;
  deliveryContext?: {
    isRedelivery: boolean;
  };
  delivered?: {
    id: string;
    userId: string;
    content: string;
    timestamp: number;
  };
}

export interface LineWebhookBody {
  destination: string;
  events: LineMessageEvent[];
}

export interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  platform: Platform;
}

export interface LineApiResponse {
  messageId: string;
}
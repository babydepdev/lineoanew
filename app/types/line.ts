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
  channelId: string;
}

export interface LineApiResponse {
  messageId: string;
}

export interface LineChannel {
  id: string;
  name: string;
  accessToken: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    conversations: number;
    userProfiles: number;
  };
}
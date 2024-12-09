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

export interface LineApiResponse {
  messageId: string;
}
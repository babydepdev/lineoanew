import { LineChannel, SerializedLineChannel } from '../types/line';
import { ConversationWithMessages, SerializedConversation } from '../types/chat';

export function serializeLineChannel(channel: LineChannel | null): SerializedLineChannel | null {
  if (!channel) return null;
  
  return {
    ...channel,
    createdAt: channel.createdAt.toISOString(),
    updatedAt: channel.updatedAt.toISOString()
  };
}

export function serializeConversation(conv: ConversationWithMessages): SerializedConversation {
  return {
    ...conv,
    messages: conv.messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    })),
    createdAt: conv.createdAt.toISOString(),
    updatedAt: conv.updatedAt.toISOString(),
    lineChannel: conv.lineChannel ? serializeLineChannel(conv.lineChannel) : null
  };
}

export function deserializeLineChannel(channel: SerializedLineChannel | null): LineChannel | null {
  if (!channel) return null;

  return {
    ...channel,
    createdAt: new Date(channel.createdAt),
    updatedAt: new Date(channel.updatedAt)
  };
}

export function deserializeConversation(conv: SerializedConversation): ConversationWithMessages {
  return {
    ...conv,
    messages: conv.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })),
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt),
    lineChannel: conv.lineChannel ? deserializeLineChannel(conv.lineChannel) : null
  };
}
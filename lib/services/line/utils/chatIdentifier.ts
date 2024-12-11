import { LineSource } from '@/app/types/line';

export function getChatIdentifier(source: LineSource): {
  chatId: string;
  chatType: string;
} {
  if (!source || !source.type) {
    throw new Error('Invalid source information');
  }

  switch (source.type) {
    case 'room':
      if (!source.roomId || !source.userId) {
        throw new Error('Missing room information');
      }
      return {
        chatId: `room_${source.roomId}_${source.userId}`,
        chatType: 'room'
      };
    case 'group':
      if (!source.groupId || !source.userId) {
        throw new Error('Missing group information');
      }
      return {
        chatId: `group_${source.groupId}_${source.userId}`,
        chatType: 'group'
      };
    case 'user':
      if (!source.userId) {
        throw new Error('Missing user information');
      }
      return {
        chatId: `user_${source.userId}`,
        chatType: 'user'
      };
    default:
      throw new Error(`Unknown source type: ${source.type}`);
  }
}
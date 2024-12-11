import { Message } from '@prisma/client';

export function getBotName(message: Message): string {
  if (message.chatType === 'group') {
    return 'Group Bot';
  } else if (message.chatType === 'room') {
    return 'Room Bot';
  } else {
    return message.platform === 'LINE' ? 'LINE Bot' : 'FB Bot';
  }
}

export function getBotAvatar(message: Message): string {
  return message.sender === 'BOT' ? 
    (message.platform === 'LINE' ? 'L' : 'F') : 
    'U';
}
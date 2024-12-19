// Re-export all message types
export * from './base';
export * from './text';
export * from './image';
export * from './line';

// Define union type for message creation
import { TextMessageParams } from './text';
import { ImageMessageParams } from './image';

export type MessageCreateParams = TextMessageParams | ImageMessageParams;
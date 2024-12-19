import { BaseMessageParams } from './base';

/**
 * Parameters specific to text messages
 */
export interface TextMessageParams extends BaseMessageParams {
  contentType: 'text';
  content: string;
}
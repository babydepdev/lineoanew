import { BaseMessageParams } from './base';

/**
 * Parameters specific to image messages
 */
export interface ImageMessageParams extends BaseMessageParams {
  contentType: 'image';
  content: string;
  contentUrl: string;
}
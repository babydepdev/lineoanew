import { ReplyTokenMetadata, ReplyTokenStore } from './types/replyToken';
import { REPLY_TOKEN_LIMITS } from './constants';

class InMemoryReplyTokenStore implements ReplyTokenStore {
  private tokens: Map<string, ReplyTokenMetadata> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000);
  }

  get(token: string): ReplyTokenMetadata | undefined {
    return this.tokens.get(token);
  }

  set(token: string, metadata: ReplyTokenMetadata): void {
    this.tokens.set(token, metadata);
  }

  markAsUsed(token: string): void {
    const metadata = this.tokens.get(token);
    if (metadata) {
      this.tokens.set(token, { ...metadata, used: true });
    }
  }

  cleanup(): void {
    const now = Date.now();
    for (const [token, metadata] of this.tokens.entries()) {
      if (now - metadata.timestamp > REPLY_TOKEN_LIMITS.MAX_AGE) {
        this.tokens.delete(token);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.tokens.clear();
  }
}

// Export singleton instance
export const replyTokenStore = new InMemoryReplyTokenStore();
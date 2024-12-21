import { QuotationWithItems } from './types';

interface CacheEntry {
  data: QuotationWithItems[];
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class QuotationCache {
  private cache = new Map<string, CacheEntry>();

  get(accountId: string): QuotationWithItems[] | null {
    const entry = this.cache.get(accountId);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL) {
      this.delete(accountId);
      return null;
    }

    return entry.data;
  }

  set(accountId: string, data: QuotationWithItems[]) {
    this.cache.set(accountId, {
      data,
      timestamp: Date.now()
    });
  }

  delete(accountId: string) {
    this.cache.delete(accountId);
  }
}

export const quotationCache = new QuotationCache();
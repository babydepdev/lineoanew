
import { redis } from './redis';
import { CACHE_KEYS, CACHE_DURATIONS } from './constants';
import { CachedQuotation } from './types';

export async function getCachedQuotations(accountId: string): Promise<CachedQuotation[] | null> {
  const cached = await redis.get<string>(CACHE_KEYS.quotations(accountId));
  return cached ? JSON.parse(cached) as CachedQuotation[] : null;
}

export async function cacheQuotations(accountId: string, quotations: CachedQuotation[]): Promise<void> {
  await redis.setex(
    CACHE_KEYS.quotations(accountId),
    CACHE_DURATIONS.QUOTATIONS,
    JSON.stringify(quotations)
  );
}

export async function invalidateQuotationsCache(accountId: string): Promise<void> {
  await redis.del(CACHE_KEYS.quotations(accountId));
}
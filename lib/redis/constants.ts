export const CACHE_DURATIONS = {
    QUOTATIONS: 60, // 1 minute
    METRICS: 300,   // 5 minutes
  } as const;
  
  export const CACHE_KEYS = {
    quotations: (accountId: string) => `quotations:${accountId}`,
    metrics: 'dashboard:metrics'
  } as const;
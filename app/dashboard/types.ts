export interface AccountStats {
    id: string;
    name: string;
    conversations: number;
    messages: number;
  }
  
  export interface DashboardMetrics {
    totalQuotations: number;
    totalAccounts: number;
    totalMessages: number;
    accountStats: AccountStats[];
  }
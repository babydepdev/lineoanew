"use client";

import { DashboardMetrics } from '@/app/types/dashboard';
import { SummaryCards } from './SummaryCards';
import { AccountStats } from './AccountStats';

interface MetricsContainerProps {
  metrics: DashboardMetrics;
}

export function MetricsContainer({ metrics }: MetricsContainerProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">Dashboard Overview</h1>
      <SummaryCards metrics={metrics} />
      <AccountStats accounts={metrics.accountStats} />
    </div>
  );
}
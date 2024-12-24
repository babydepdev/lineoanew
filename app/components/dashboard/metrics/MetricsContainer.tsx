"use client";

import { DashboardMetrics } from '@/app/types/dashboard';
import { SummaryCards } from './SummaryCards';
import { AccountStats } from './AccountStats';
import { useDashboardMetrics } from '@/app/hooks/useDashboardMetrics';

interface MetricsContainerProps {
  metrics: DashboardMetrics;
}

export function MetricsContainer({ metrics: initialMetrics }: MetricsContainerProps) {
  const metrics = useDashboardMetrics(initialMetrics);

  // Add null check and default values
  if (!metrics) {
    return <MetricsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">Dashboard Overview</h1>
      <SummaryCards metrics={metrics} />
      <AccountStats accounts={metrics.accountStats || []} />
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
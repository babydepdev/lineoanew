import { DashboardMetrics as DashboardMetricsComponent } from './components/DashboardMetrics';
import { getDashboardMetrics } from './services/metrics';

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  
  return (
    <div className="min-h-screen bg-background">
      <DashboardMetricsComponent metrics={metrics} />
    </div>
  );
}
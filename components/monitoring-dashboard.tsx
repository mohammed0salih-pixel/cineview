import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface MonitoringData {
  timestamp: string;
  environment: string;
  metrics?: {
    totalRequests: number;
    avgDuration: number;
    p95Duration: number;
    p99Duration: number;
    totalErrors: number;
    errorRate: number;
  };
  errors?: {
    totalErrors: number;
    errorsByType: Record<string, number>;
  };
  sentry?: {
    enabled: boolean;
  };
}

export function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        const response = await fetch('/api/monitoring/status');
        if (!response.ok) {
          throw new Error(`Failed to fetch monitoring data: ${response.statusText}`);
        }
        const monitoringData: MonitoringData = await response.json();
        setData(monitoringData);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Loading monitoring data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Monitoring Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const errorRateStatus =
    (data.metrics?.errorRate ?? 0) > 2
      ? 'critical'
      : (data.metrics?.errorRate ?? 0) > 0.5
        ? 'warning'
        : 'healthy';

  const performanceStatus =
    (data.metrics?.p95Duration ?? 0) > 3000
      ? 'critical'
      : (data.metrics?.p95Duration ?? 0) > 1500
        ? 'warning'
        : 'healthy';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Monitoring</CardTitle>
          <CardDescription>
            Last updated: {lastUpdate?.toLocaleTimeString()} ({data.environment})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Rate Alert */}
          {errorRateStatus !== 'healthy' && (
            <Alert variant={errorRateStatus === 'critical' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {errorRateStatus === 'critical' ? 'High Error Rate' : 'Elevated Error Rate'}
              </AlertTitle>
              <AlertDescription>
                Current error rate: {data.metrics?.errorRate ?? 0}%
                {errorRateStatus === 'critical' ? ' (threshold: > 2%)' : ' (threshold: > 0.5%)'}
              </AlertDescription>
            </Alert>
          )}

          {/* Performance Alert */}
          {performanceStatus !== 'healthy' && (
            <Alert variant={performanceStatus === 'critical' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {performanceStatus === 'critical' ? 'Slow Performance' : 'Elevated Latency'}
              </AlertTitle>
              <AlertDescription>
                P95 response time: {data.metrics?.p95Duration ?? 0}ms
                {performanceStatus === 'critical' ? ' (threshold: > 3000ms)' : ' (threshold: > 1500ms)'}
              </AlertDescription>
            </Alert>
          )}

          {/* Metrics Grid */}
          {data.metrics && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Total Requests</div>
                <div className="text-2xl font-bold">{data.metrics.totalRequests}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Avg Duration</div>
                <div className="text-2xl font-bold">{data.metrics.avgDuration}ms</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">P95 Duration</div>
                <div className={`text-2xl font-bold ${performanceStatus === 'critical' ? 'text-red-600' : performanceStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {data.metrics.p95Duration}ms
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Error Rate</div>
                <div className={`text-2xl font-bold ${errorRateStatus === 'critical' ? 'text-red-600' : errorRateStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {data.metrics.errorRate}%
                </div>
              </div>
            </div>
          )}

          {/* Detailed Metrics */}
          {data.metrics && (
            <div className="space-y-2">
              <h4 className="font-semibold">Detailed Metrics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Avg Duration: {Math.round(data.metrics.avgDuration)}ms</div>
                <div>P95 Duration: {Math.round(data.metrics.p95Duration)}ms</div>
                <div>P99 Duration: {Math.round(data.metrics.p99Duration)}ms</div>
                <div>Total Errors: {data.metrics.totalErrors}</div>
              </div>
            </div>
          )}

          {/* Error Summary */}
          {data.errors && Object.keys(data.errors.errorsByType).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Errors by Type</h4>
              <div className="space-y-1">
                {Object.entries(data.errors.errorsByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span>{type}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              {errorRateStatus === 'healthy' && performanceStatus === 'healthy' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              <span className="font-medium">
                {errorRateStatus === 'healthy' && performanceStatus === 'healthy'
                  ? 'System Healthy'
                  : 'System Degraded'}
              </span>
            </div>
            <div className="text-sm text-gray-500">{data.timestamp}</div>
          </div>

          {/* Sentry Status */}
          {data.sentry && (
            <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
              <span className="text-sm font-medium">
                {data.sentry.enabled ? '✅ Error Monitoring Active' : '⚠️ Error Monitoring Disabled'}
              </span>
              {data.sentry.enabled && <span className="text-xs text-gray-500">Sentry</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

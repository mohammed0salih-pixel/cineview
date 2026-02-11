import { NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';
import { getEnv } from '@/lib/env';

interface MonitoringStatus {
  timestamp: string;
  environment: string;
  metrics?: {
    totalRequests: number;
    avgDuration: number;
    p95Duration: number;
    p99Duration: number;
    minDuration: number;
    maxDuration: number;
    totalErrors: number;
    errorRate: number;
  };
  errors?: {
    totalErrors: number;
    errorsByType: Record<string, number>;
  };
  sentry?: {
    enabled: boolean;
    dsn?: string;
  };
}

export async function GET() {
  try {
    const metricsSummary = monitoring.getMetricsSummary();
    const errorSummary = monitoring.getErrorSummary();
    
    const sentryDsn = getEnv('NEXT_PUBLIC_SENTRY_DSN');
    const environment = getEnv('NEXT_PUBLIC_SENTRY_ENVIRONMENT', 'development');
    
    // Calculate error rate
    let errorRate = 0;
    if (metricsSummary && metricsSummary.totalMetrics > 0) {
      errorRate = (metricsSummary.totalErrors / metricsSummary.totalMetrics) * 100;
    }

    const status: MonitoringStatus = {
      timestamp: new Date().toISOString(),
      environment: environment ?? 'development',
      metrics: metricsSummary
        ? {
            totalRequests: metricsSummary.totalMetrics,
            avgDuration: metricsSummary.avgDuration,
            p95Duration: metricsSummary.p95,
            p99Duration: metricsSummary.p99,
            minDuration: metricsSummary.minDuration,
            maxDuration: metricsSummary.maxDuration,
            totalErrors: metricsSummary.totalErrors,
            errorRate: Math.round(errorRate * 100) / 100,
          }
        : undefined,
      errors: errorSummary || undefined,
      sentry: {
        enabled: !!sentryDsn,
        dsn: sentryDsn ? `${sentryDsn.split('@')[0]}@...` : undefined,
      },
    };

    // Check if we should alert (error rate > 2%)
    const shouldAlert = errorRate > 2;
    const statusCode = shouldAlert ? 503 : 200;

    return NextResponse.json(status, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: 'Failed to get monitoring status',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

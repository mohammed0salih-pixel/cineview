import { captureException, addBreadcrumb } from "./sentry-init";

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface ErrorMetric {
  type: string;
  message: string;
  timestamp: number;
  stack?: string;
  tags?: Record<string, string>;
}

class MonitoringService {
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorMetric[] = [];
  private maxMetrics = 100;

  /**
   * Record a performance metric
   */
  recordMetric(name: string, duration: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      tags,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations
    if (duration > 1000) {
      console.warn(`⚠️  Slow operation: ${name} took ${duration}ms`);
      addBreadcrumb(`Slow operation: ${name}`, "performance", "warning", { duration, tags });
    }

    // Send to Sentry if in production
    if (process.env.NODE_ENV === "production" && duration > 3000) {
      captureException(new Error(`Slow operation: ${name} (${duration}ms)`), {
        name,
        duration,
        tags,
      });
    }
  }

  /**
   * Measure execution time of a function
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.recordMetric(name, duration, tags);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.recordMetric(name, duration, { ...tags, error: "true" });
      throw error;
    }
  }

  /**
   * Measure execution time of a synchronous function
   */
  measureSync<T>(name: string, fn: () => T, tags?: Record<string, string>): T {
    const start = Date.now();
    try {
      const result = fn();
      const duration = Date.now() - start;
      this.recordMetric(name, duration, tags);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.recordMetric(name, duration, { ...tags, error: "true" });
      throw error;
    }
  }

  /**
   * Record an error for analysis
   */
  recordError(error: Error | string, type: string, tags?: Record<string, string>) {
    const errorMetric: ErrorMetric = {
      type,
      message: typeof error === "string" ? error : error.message,
      timestamp: Date.now(),
      stack: typeof error === "string" ? undefined : error.stack,
      tags,
    };

    this.errors.push(errorMetric);

    // Keep only recent errors
    if (this.errors.length > this.maxMetrics) {
      this.errors = this.errors.slice(-this.maxMetrics);
    }

    // Report to Sentry
    if (process.env.NODE_ENV === "production") {
      const errorObj = typeof error === "string" ? new Error(error) : error;
      captureException(errorObj, { type, tags });
    }
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary() {
    if (this.metrics.length === 0) {
      return null;
    }

    const durations = this.metrics.map((m) => m.duration);
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / durations.length;
    const max = Math.max(...durations);
    const min = Math.min(...durations);

    // Calculate percentiles
    const sorted = [...durations].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return {
      totalMetrics: this.metrics.length,
      totalErrors: this.errors.length,
      avgDuration: Math.round(avg),
      minDuration: min,
      maxDuration: max,
      p50: p50,
      p95: p95,
      p99: p99,
    };
  }

  /**
   * Get error summary
   */
  getErrorSummary() {
    if (this.errors.length === 0) {
      return null;
    }

    const errorsByType = this.errors.reduce(
      (acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalErrors: this.errors.length,
      errorsByType,
    };
  }

  /**
   * Clear metrics and errors
   */
  clear() {
    this.metrics = [];
    this.errors = [];
  }
}

export const monitoring = new MonitoringService();

/**
 * Create a performance marker for user-centric metrics
 */
export function markPerformanceMetric(name: string) {
  if (typeof window !== "undefined" && window.performance) {
    window.performance.mark(name);
  }
}

/**
 * Measure performance between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (typeof window !== "undefined" && window.performance) {
    try {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name)[0];
      if (measure) {
        monitoring.recordMetric(name, measure.duration);
      }
    } catch (error) {
      console.error("Failed to measure performance:", error);
    }
  }
}

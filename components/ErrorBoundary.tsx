'use client';

import React from 'react';
import { logger } from '../lib/logger';

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Send to logging service later; for now, structured console
    // (Replace with Sentry/Datadog in production)
    logger.error('ErrorBoundary caught', { error, info });
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white/90 dark:bg-slate-900/90 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">
              An unexpected error occurred. You can retry or contact support if the
              problem persists.
            </p>
            <div className="flex gap-3">
              <button className="btn btn-primary" onClick={this.reset}>
                Retry
              </button>
            </div>
            <details className="mt-4 text-xs text-muted-foreground">
              <summary>Error details</summary>
              <pre className="whitespace-pre-wrap">{String(this.state.error)}</pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

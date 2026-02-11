// Sentry initialization for Next.js
// This file is imported early in the app to set up error tracking and performance monitoring

import * as Sentry from "@sentry/nextjs";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

if (process.env.NEXT_PUBLIC_SENTRY_DSN && isProduction) {
  Sentry.init({
    // DSN is set via environment variable
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Set the environment
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",

    // Performance monitoring
    tracesSampleRate: 0.1, // Sample 10% of transactions in production
    profilesSampleRate: 0.05, // Sample 5% for profiling

    // Set initial scope
    initialScope: {
      tags: {
        version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
        deployment: process.env.NEXT_PUBLIC_DEPLOYMENT_REGION || "unknown",
      },
    },

    // Before sending to Sentry (filtering)
    beforeSend(event, hint) {
      // Don't send 4xx errors (client errors)
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error) {
          // Filter out known non-critical errors
          if (
            error.message.includes("Network request failed") ||
            error.message.includes("User cancelled")
          ) {
            return null;
          }
        }
      }

      return event;
    },

    // Setup integrations
    integrations: [
      // Replay integration is handled separately in Sentry v8+
    ],

    // Replay configuration
    replaysSessionSampleRate: 0.1, // Record 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Record 100% of sessions with errors
  });
}

export function captureException(
  error: Error | unknown,
  context?: Record<string, any>
) {
  if (!isProduction) {
    console.error("Error:", error);
    if (context) {
      console.error("Context:", context);
    }
    return;
  }

  Sentry.captureException(error, {
    contexts: context ? { additional: context } : undefined,
  });
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (!isProduction) {
    console.log(`[${level}]`, message);
    return;
  }

  Sentry.captureMessage(message, level);
}

export function addBreadcrumb(
  message: string,
  category: string,
  level: "info" | "warning" | "error" = "info",
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

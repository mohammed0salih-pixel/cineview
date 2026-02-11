import { NextResponse } from 'next/server';

type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

const stores = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): NextResponse | null => {
    const now = Date.now();
    const store = stores.get(identifier);

    if (!store || now > store.resetAt) {
      stores.set(identifier, {
        count: 1,
        resetAt: now + config.windowMs,
      });
      return null;
    }

    if (store.count >= config.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((store.resetAt - now) / 1000) },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((store.resetAt - now) / 1000)) } }
      );
    }

    store.count += 1;
    return null;
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of stores.entries()) {
    if (now > value.resetAt) {
      stores.delete(key);
    }
  }
}, 60000); // Cleanup every minute

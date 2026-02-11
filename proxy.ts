import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAccessTokenFromRequest } from '@/lib/api-auth';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const rateMap = new Map<string, { count: number; reset: number }>();
const PUBLIC_PATHS = new Set(['/api/health']);

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  // NextRequest does not expose `ip` — prefer headers (x-real-ip) or fallback
  return req.headers.get('x-real-ip') || 'unknown';
}

export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (!PUBLIC_PATHS.has(req.nextUrl.pathname) && req.method !== 'OPTIONS') {
    const accessToken = getAccessTokenFromRequest(req);
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const current = rateMap.get(ip);

  if (!current || now > current.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (current.count >= MAX_REQUESTS) {
    const retryAfter = Math.max(0, Math.ceil((current.reset - now) / 1000));
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      },
    );
  }

  current.count += 1;
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};

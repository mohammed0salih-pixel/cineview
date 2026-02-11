import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';
import { logger } from '@/lib/logger';
import { cronJobSchema } from '@/lib/validation';

function isAuthorized(req: Request) {
  const secret = getEnv('CRON_SECRET');
  if (!secret) return true;
  const header = req.headers.get('x-cron-secret');
  const { searchParams } = new URL(req.url);
  const token = header || searchParams.get('token');
  return token === secret;
}

export async function GET(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('cron:heartbeat', { at: new Date().toISOString() });

    return NextResponse.json({ ok: true, job: 'heartbeat', at: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await req.json().catch(() => ({}));
    const validation = cronJobSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid request body', details: validation.error.format() },
        { status: 400 }
      );
    }
    const body = validation.data;
    logger.info('cron:run', { body });

    return NextResponse.json({ ok: true, job: body?.job ?? 'manual' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

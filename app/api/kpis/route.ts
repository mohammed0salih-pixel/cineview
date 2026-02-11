import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAccessTokenFromRequest } from '@/lib/api-auth';
import { fetchUserRunScope, verifyProjectOwnership } from '@/lib/api-ownership';
import { getEnv } from '@/lib/env';
import { kpiFilterSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({ windowMs: 60000, maxRequests: 30 });

export async function GET(req: Request) {
  try {
    const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing Supabase env vars' }, { status: 500 });
    }

    const accessToken = getAccessTokenFromRequest(req);
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitResult = limiter(authData.user.id);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { searchParams } = new URL(req.url);
    const validation = kpiFilterSchema.safeParse({
      project_id: searchParams.get('project_id'),
      since: searchParams.get('since'),
    });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.format() },
        { status: 400 }
      );
    }
    const { project_id: projectId, since: sinceParam } = validation.data;
    const sinceDate = sinceParam
      ? new Date(sinceParam)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const maxRows = 1000;
    let query = supabase
      .from('usage_metrics')
      .select('cost_usd,total_tokens,latency_ms,cache_hit')
      .gte('occurred_at', sinceDate.toISOString())
      .order('occurred_at', { ascending: false })
      .range(0, maxRows - 1);

    if (projectId) {
      const ownsProject = await verifyProjectOwnership(
        supabase,
        authData.user.id,
        projectId,
      );
      if (!ownsProject) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      query = query.eq('project_id', projectId);
    } else {
      const { runIds, projectIds } = await fetchUserRunScope(supabase, authData.user.id);
      if (!runIds.length && !projectIds.length) {
        return NextResponse.json(
          {
            ok: true,
            metrics: {
              requests: 0,
              total_cost_usd: 0,
              total_tokens: 0,
              avg_latency_ms: 0,
              cache_hit_rate: 0,
              sampled: false,
              window_start: sinceDate.toISOString(),
            },
          },
          {
            headers: {
              'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
            },
          },
        );
      }
      if (runIds.length && projectIds.length) {
        query = query.or(
          `analysis_run_id.in.(${runIds.join(',')}),project_id.in.(${projectIds.join(',')})`,
        );
      } else if (runIds.length) {
        query = query.in('analysis_run_id', runIds);
      } else if (projectIds.length) {
        query = query.in('project_id', projectIds);
      }
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = data ?? [];
    const totals = rows.reduce(
      (acc, row) => {
        acc.totalCost += Number(row.cost_usd ?? 0);
        acc.totalTokens += Number(row.total_tokens ?? 0);
        acc.totalLatency += Number(row.latency_ms ?? 0);
        acc.cacheHits += row.cache_hit ? 1 : 0;
        return acc;
      },
      { totalCost: 0, totalTokens: 0, totalLatency: 0, cacheHits: 0 },
    );

    const count = rows.length;
    const metrics = {
      requests: count,
      total_cost_usd: Number(totals.totalCost.toFixed(4)),
      total_tokens: totals.totalTokens,
      avg_latency_ms: count ? Math.round(totals.totalLatency / count) : 0,
      cache_hit_rate: count ? Number((totals.cacheHits / count).toFixed(3)) : 0,
      sampled: count >= maxRows,
      window_start: sinceDate.toISOString(),
    };

    return NextResponse.json(
      { ok: true, metrics },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

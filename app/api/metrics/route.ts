import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { computeTotalTokens, estimateCostUsd } from '@/lib/metrics';
import { getAccessTokenFromRequest } from '@/lib/api-auth';
import { verifyAnalysisRunOwnership, verifyProjectOwnership } from '@/lib/api-ownership';
import { getEnv } from '@/lib/env';
import { metricsPayloadSchema } from '@/lib/validation';

type MetricsPayload = {
  project_id?: string;
  analysis_run_id?: string;
  request_id?: string;
  provider?: string;
  model?: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  price_per_1k_prompt?: number;
  price_per_1k_completion?: number;
  cost_usd?: number;
  latency_ms?: number;
  cache_hit?: boolean;
  metadata?: Record<string, unknown>;
};

export async function POST(req: Request) {
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

    const rawBody = await req.json();
    const validation = metricsPayloadSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.format() },
        { status: 400 }
      );
    }
    const body: MetricsPayload = validation.data;
    const userId = authData.user.id;

    if (body.analysis_run_id) {
      const ownsRun = await verifyAnalysisRunOwnership(
        supabase,
        userId,
        body.analysis_run_id,
      );
      if (!ownsRun) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else if (body.project_id) {
      const ownsProject = await verifyProjectOwnership(supabase, userId, body.project_id);
      if (!ownsProject) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      return NextResponse.json(
        { error: 'project_id or analysis_run_id required' },
        { status: 400 },
      );
    }

    const totalTokens = computeTotalTokens({
      totalTokens: body.total_tokens,
      promptTokens: body.prompt_tokens,
      completionTokens: body.completion_tokens,
    });

    const estimatedCost = estimateCostUsd(
      {
        promptTokens: body.prompt_tokens,
        completionTokens: body.completion_tokens,
        totalTokens: body.total_tokens,
      },
      {
        pricePer1kPrompt: body.price_per_1k_prompt,
        pricePer1kCompletion: body.price_per_1k_completion,
      },
    );

    const { error } = await supabase.from('usage_metrics').insert({
      project_id: body.project_id ?? null,
      analysis_run_id: body.analysis_run_id ?? null,
      request_id: body.request_id ?? null,
      provider: body.provider ?? null,
      model: body.model ?? null,
      prompt_tokens: body.prompt_tokens ?? null,
      completion_tokens: body.completion_tokens ?? null,
      total_tokens: Number.isFinite(totalTokens) ? totalTokens : null,
      cost_usd: body.cost_usd ?? estimatedCost,
      latency_ms: body.latency_ms ?? null,
      cache_hit: body.cache_hit ?? false,
      metadata: body.metadata ?? {},
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

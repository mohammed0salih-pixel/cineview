import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAccessTokenFromRequest } from '@/lib/api-auth';
import { verifyAnalysisRunOwnership, verifyProjectOwnership } from '@/lib/api-ownership';
import { getEnv } from '@/lib/env';
import { auditLogSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({ windowMs: 60000, maxRequests: 100 });

type AuditPayload = {
  action: string;
  entity_type: string;
  entity_id?: string;
  project_id?: string;
  analysis_run_id?: string;
  trace_id?: string;
  asset_id?: string;
  insight_id?: string;
  export_id?: string;
  request_id?: string;
  input_hash?: string;
  output_hash?: string;
  diff?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  actor_id?: string;
  actor_email?: string;
  actor_role?: string;
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

    const rateLimitResult = limiter(accessToken);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await req.json();
    const validation = auditLogSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.format() },
        { status: 400 }
      );
    }
    const body: AuditPayload = validation.data;
    const userId = authData.user.id;

    if (!body.analysis_run_id && !body.project_id) {
      return NextResponse.json(
        { error: 'analysis_run_id or project_id required' },
        { status: 400 }
      );
    }

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
    }

    if (!body?.action || !body?.entity_type) {
      return NextResponse.json(
        { error: 'action and entity_type required' },
        { status: 400 },
      );
    }

    const { error } = await supabase.from('audit_logs').insert({
      action: body.action,
      entity_type: body.entity_type,
      entity_id: body.entity_id ?? null,
      project_id: body.project_id ?? null,
      analysis_run_id: body.analysis_run_id ?? null,
      trace_id: body.trace_id ?? null,
      asset_id: body.asset_id ?? null,
      insight_id: body.insight_id ?? null,
      export_id: body.export_id ?? null,
      request_id: body.request_id ?? null,
      input_hash: body.input_hash ?? null,
      output_hash: body.output_hash ?? null,
      diff: body.diff ?? null,
      metadata: body.metadata ?? null,
      actor_id: userId,
      actor_email: authData.user.email ?? null,
      actor_role: body.actor_role ?? null,
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

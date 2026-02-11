import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { getAccessTokenFromRequest } from '@/lib/api-auth';
import { generateMoodboard, generateStoryboard } from '@/lib/creative-generation';
import { buildCreativeDecision } from '@/lib/decision-engine';
import { writeAuditLog } from '@/lib/audit-log';
import { getEnv } from '@/lib/env';
import { analysisPayloadSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

type AnalysisPayload = {
  project_id?: string;
  project_name?: string;
  project_type?: string;
  platform?: string;
  media?: {
    name?: string;
    type?: 'image' | 'video';
    size_bytes?: number;
    storage_path?: string;
    preview_url?: string | null;
    metadata?: Record<string, unknown>;
  };
  analysis: Record<string, unknown>;
  analysis_status?: 'loading' | 'analyzing' | 'completed';
  analysis_started_at?: string;
  analysis_completed_at?: string;
  pipeline_version?: string;
  input_fingerprint?: string;
};

const hashValue = (value: string) => createHash('sha256').update(value).digest('hex');
const limiter = rateLimit({ windowMs: 60000, maxRequests: 20 });

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

    const rateLimitResult = limiter(authData.user.id);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const rawBody = await req.json();
    const validation = analysisPayloadSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.format() },
        { status: 400 }
      );
    }
    const body: AnalysisPayload = validation.data;
    if (!body?.analysis) {
      return NextResponse.json({ error: 'analysis payload required' }, { status: 400 });
    }

    const userId = authData.user.id;
    const now = new Date().toISOString();

    let projectId = body.project_id;
    if (projectId) {
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('owner_id', userId)
        .single();
      if (!existingProject) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: body.project_name || 'Untitled Project',
          description: body.project_type ? `Type: ${body.project_type}` : null,
          status: 'active',
          owner_id: userId,
        })
        .select('id')
        .single();

      if (projectError || !project) {
        return NextResponse.json(
          { error: projectError?.message || 'Failed to create project' },
          { status: 500 },
        );
      }
      projectId = project.id;
    }

    const mediaPayload = body.media ?? {};
    const mediaType = mediaPayload.type ?? 'image';
    const storagePath =
      mediaPayload.storage_path ?? `local:${mediaPayload.name ?? 'upload'}`;

    const { data: media, error: mediaError } = await supabase
      .from('media')
      .insert({
        project_id: projectId,
        created_by: userId,
        media_type: mediaType,
        storage_path: storagePath,
        size_bytes: mediaPayload.size_bytes ?? null,
        metadata: {
          ...(mediaPayload.metadata ?? {}),
          name: mediaPayload.name ?? null,
          platform: body.platform ?? null,
          preview_url: mediaPayload.preview_url ?? null,
        },
      })
      .select('id')
      .single();

    if (mediaError || !media) {
      return NextResponse.json(
        { error: mediaError?.message || 'Failed to create media' },
        { status: 500 },
      );
    }

    const inputFingerprint =
      body.input_fingerprint ??
      JSON.stringify({
        name: mediaPayload.name ?? null,
        size: mediaPayload.size_bytes ?? null,
        type: mediaType,
        project_id: projectId,
      });

    const outputFingerprint = JSON.stringify(body.analysis);

    const { data: run, error: runError } = await supabase
      .from('analysis_runs')
      .insert({
        project_id: projectId,
        asset_id: media.id,
        status: body.analysis_status ?? 'completed',
        progress: body.analysis_status === 'completed' ? 100 : 50,
        pipeline_version: body.pipeline_version ?? 'v1-client',
        input_hash: hashValue(inputFingerprint),
        output_hash: hashValue(outputFingerprint),
        metadata: {
          project_type: body.project_type ?? null,
          platform: body.platform ?? null,
        },
        started_at: body.analysis_started_at ?? now,
        completed_at: body.analysis_completed_at ?? now,
        created_by: userId,
      })
      .select('id')
      .single();

    if (runError || !run) {
      return NextResponse.json(
        { error: runError?.message || 'Failed to create analysis run' },
        { status: 500 },
      );
    }

    const decision = buildCreativeDecision(body.analysis as Record<string, unknown>, {
      projectType: body.project_type,
      platform: body.platform,
      objective: mediaPayload.metadata?.objective as string | undefined,
      media: {
        name: mediaPayload.name,
        type: mediaPayload.type,
        mimeType: mediaPayload.metadata?.mime_type as string | undefined,
        sizeBytes: mediaPayload.size_bytes ?? null,
      },
    });

    const { count: insightCount } = await supabase
      .from('creative_insights')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);

    const insightVersion = `v${(insightCount ?? 0) + 1}`;

    const insightsPayload = {
      ...(body.analysis || {}),
      decision: {
        ...decision,
        version: insightVersion,
      },
    };

    const { data: insight, error: insightError } = await supabase
      .from('creative_insights')
      .insert({
        project_id: projectId,
        analysis_run_id: run.id,
        media_id: media.id,
        summary: 'Automated visual analysis',
        insights: insightsPayload,
        created_by: userId,
      })
      .select('id')
      .single();

    if (insightError || !insight) {
      return NextResponse.json(
        { error: insightError?.message || 'Failed to create insights' },
        { status: 500 },
      );
    }

    const previewUrl = mediaPayload.preview_url ?? null;
    const storyboard = generateStoryboard(
      body.analysis as Record<string, unknown>,
      previewUrl,
    );
    const moodboard = generateMoodboard(
      body.analysis as Record<string, unknown>,
      previewUrl,
    );

    const { data: storyboardRow, error: storyboardError } = await supabase
      .from('storyboards')
      .insert({
        project_id: projectId,
        title: storyboard.title,
        description: storyboard.description,
        frames: storyboard.frames,
        created_by: userId,
      })
      .select('id')
      .single();

    if (storyboardError || !storyboardRow) {
      return NextResponse.json(
        { error: storyboardError?.message || 'Failed to create storyboard' },
        { status: 500 },
      );
    }

    const { data: moodboardRow, error: moodboardError } = await supabase
      .from('moodboards')
      .insert({
        project_id: projectId,
        title: moodboard.title,
        description: moodboard.description,
        items: moodboard.items,
        created_by: userId,
      })
      .select('id')
      .single();

    if (moodboardError || !moodboardRow) {
      return NextResponse.json(
        { error: moodboardError?.message || 'Failed to create moodboard' },
        { status: 500 },
      );
    }

    const decisionHash = hashValue(JSON.stringify(insightsPayload.decision));

    const { data: trace, error: traceError } = await supabase
      .from('analysis_traceability')
      .insert({
        analysis_run_id: run.id,
        insight_id: insight.id,
        decision_fingerprint: hashValue(`${run.id}:${insight.id}`),
        input_hash: hashValue(inputFingerprint),
        output_hash: hashValue(outputFingerprint),
        cache_key: null,
        cache_hit: false,
        latency_ms: null,
        token_cost_usd: null,
        kpis: {},
        metadata: {
          source: 'client',
          pipeline_version: body.pipeline_version ?? 'v1-client',
          decision_version: decision.engine_version,
          decision_hash: decisionHash,
        },
      })
      .select('id')
      .single();

    if (traceError || !trace) {
      return NextResponse.json(
        { error: traceError?.message || 'Failed to create traceability' },
        { status: 500 },
      );
    }

    const auditMetadata = {
      decision_version: decision.engine_version,
      decision_hash: decisionHash,
      insight_version: insightVersion,
    };

    try {
      await writeAuditLog(supabase, {
        action: 'analysis.run.created',
        entity_type: 'analysis_runs',
        entity_id: run.id,
        project_id: projectId,
        analysis_run_id: run.id,
        asset_id: media.id,
        input_hash: hashValue(inputFingerprint),
        output_hash: hashValue(outputFingerprint),
        actor_id: userId,
        actor_email: authData.user.email ?? null,
        metadata: auditMetadata,
      });
      await writeAuditLog(supabase, {
        action: 'creative_insight.created',
        entity_type: 'creative_insights',
        entity_id: insight.id,
        project_id: projectId,
        analysis_run_id: run.id,
        insight_id: insight.id,
        actor_id: userId,
        actor_email: authData.user.email ?? null,
        metadata: auditMetadata,
      });
      await writeAuditLog(supabase, {
        action: 'storyboard.generated',
        entity_type: 'storyboards',
        entity_id: storyboardRow.id,
        project_id: projectId,
        analysis_run_id: run.id,
        insight_id: insight.id,
        actor_id: userId,
        actor_email: authData.user.email ?? null,
        metadata: auditMetadata,
      });
      await writeAuditLog(supabase, {
        action: 'moodboard.generated',
        entity_type: 'moodboards',
        entity_id: moodboardRow.id,
        project_id: projectId,
        analysis_run_id: run.id,
        insight_id: insight.id,
        actor_id: userId,
        actor_email: authData.user.email ?? null,
        metadata: auditMetadata,
      });
      await writeAuditLog(supabase, {
        action: 'traceability.created',
        entity_type: 'analysis_traceability',
        entity_id: trace.id,
        project_id: projectId,
        analysis_run_id: run.id,
        trace_id: trace.id,
        actor_id: userId,
        actor_email: authData.user.email ?? null,
        metadata: auditMetadata,
      });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      project_id: projectId,
      media_id: media.id,
      analysis_run_id: run.id,
      insight_id: insight.id,
      trace_id: trace.id,
      storyboard_id: storyboardRow.id,
      moodboard_id: moodboardRow.id,
      insight_version: insightVersion,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

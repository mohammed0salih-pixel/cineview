import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getAccessTokenFromRequest } from '@/lib/api-auth';
import { verifyAnalysisRunOwnership } from '@/lib/api-ownership';
import { writeAuditLog } from '@/lib/audit-log';
import { getEnv } from '@/lib/env';
import { exportZipSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

type ExportZipPayload = {
  analysis_run_id?: string;
  export_type?: string;
  format?: string;
  metadata?: Record<string, unknown>;
};

const limiter = rateLimit({ windowMs: 60000, maxRequests: 5 });

async function getNextExportVersion(
  supabase: SupabaseClient,
  projectId: string,
  exportType: string,
  format: string,
) {
  const { count } = await supabase
    .from('exports')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('export_type', exportType)
    .eq('format', format);

  return (count ?? 0) + 1;
}

async function ensureBucket(supabase: SupabaseClient, bucket: string) {
  const { data: bucketInfo, error } = await supabase.storage.getBucket(bucket);
  if (bucketInfo && !error) return;
  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: false,
    allowedMimeTypes: ['application/zip'],
  });
  if (createError && !createError.message.toLowerCase().includes('already exists')) {
    throw new Error(createError.message);
  }
}

export async function POST(req: Request) {
  try {
    const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');
    const EXPORTS_BUCKET = getEnv('SUPABASE_EXPORTS_BUCKET', 'exports') ?? 'exports';

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
    const validation = exportZipSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.format() },
        { status: 400 },
      );
    }

    const body: ExportZipPayload = validation.data;
    if (!body?.analysis_run_id) {
      return NextResponse.json({ error: 'analysis_run_id required' }, { status: 400 });
    }

    const userId = authData.user.id;
    const ownsRun = await verifyAnalysisRunOwnership(supabase, userId, body.analysis_run_id);
    if (!ownsRun) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: run, error: runError } = await supabase
      .from('analysis_runs')
      .select('id,project_id,asset_id,status,created_at,completed_at,input_hash,pipeline_version')
      .eq('id', body.analysis_run_id)
      .single();

    if (runError || !run) {
      return NextResponse.json(
        { error: runError?.message || 'Analysis run not found' },
        { status: 404 },
      );
    }

    if (!run.project_id) {
      return NextResponse.json(
        { error: 'analysis_run missing project_id' },
        { status: 400 },
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id,name')
      .eq('id', run.project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: projectError?.message || 'Project not found' },
        { status: 404 },
      );
    }

    try {
      await ensureBucket(supabase, EXPORTS_BUCKET);
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

    const storagePath = `projects/${run.project_id}/exports/local-zip-${run.id}.zip`;
    const exportType = body.export_type ?? 'production_handoff';
    const exportFormat = body.format ?? 'zip';
    const exportVersion = await getNextExportVersion(
      supabase,
      run.project_id,
      exportType,
      exportFormat,
    );

    const { data: exportRow, error: exportError } = await supabase
      .from('exports')
      .insert({
        project_id: run.project_id,
        analysis_run_id: run.id,
        media_id: run.asset_id,
        export_type: exportType,
        format: exportFormat,
        storage_path: storagePath,
        created_by: userId,
        metadata: {
          bucket: EXPORTS_BUCKET,
          file_name: `${project.name}-production-handoff.zip`,
          storage_mode: 'local',
          signed_expires_in: null,
          export_version: exportVersion,
          input_hash: run.input_hash ?? null,
          pipeline_version: run.pipeline_version ?? null,
          ...(body.metadata ?? {}),
        },
      })
      .select('id')
      .single();

    if (exportError || !exportRow) {
      return NextResponse.json(
        { error: exportError?.message || 'Failed to save export record' },
        { status: 500 },
      );
    }

    await supabase
      .from('analysis_traceability')
      .update({ export_id: exportRow.id })
      .eq('analysis_run_id', run.id);

    try {
      await writeAuditLog(supabase, {
        action: 'export.zip.generated',
        entity_type: 'exports',
        entity_id: exportRow.id,
        project_id: run.project_id,
        analysis_run_id: run.id,
        export_id: exportRow.id,
        actor_id: userId,
        actor_email: authData.user.email ?? null,
        metadata: {
          format: exportFormat,
          storage_path: storagePath,
          export_version: exportVersion,
          input_hash: run.input_hash ?? null,
          pipeline_version: run.pipeline_version ?? null,
          ...(body.metadata ?? {}),
        },
      });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      export_id: exportRow.id,
      storage_path: storagePath,
      bucket: EXPORTS_BUCKET,
      export_version: exportVersion,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

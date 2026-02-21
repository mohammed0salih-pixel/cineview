import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAccessTokenFromRequest } from '@/lib/api-auth';
import { getEnv } from '@/lib/env';
import { canonicalizeAnalysisResult, validateAnalysisResult } from '@/lib/analysis/schema';

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
    const userId = authData.user.id;
    const url = new URL(req.url);
    const projectId = url.searchParams.get('project_id');
    const assetId = url.searchParams.get('asset_id');
    let query = supabase.from('analysis_runs').select('canonical_result').eq('created_by', userId);
    if (projectId) query = query.eq('project_id', projectId);
    if (assetId) query = query.eq('asset_id', assetId);
    query = query.order('created_at', { ascending: false }).limit(1);
    const { data, error } = await query;
    if (error || !data || !data[0]) {
      return NextResponse.json({ error: 'No analysis found' }, { status: 404 });
    }
    const canonicalResult = data[0].canonical_result;
    try {
      validateAnalysisResult(canonicalResult);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid canonical analysis result', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
    return NextResponse.json({ result: canonicalResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

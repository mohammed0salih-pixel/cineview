import type { SupabaseClient } from '@supabase/supabase-js';

export async function verifyAnalysisRunOwnership(
  supabase: SupabaseClient,
  userId: string,
  analysisRunId: string,
) {
  const { data, error } = await supabase
    .from('analysis_runs')
    .select('id')
    .eq('id', analysisRunId)
    .eq('created_by', userId)
    .limit(1);

  if (error) return false;
  return Array.isArray(data) && data.length > 0;
}

export async function verifyProjectOwnership(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
) {
  const { data, error } = await supabase
    .from('analysis_runs')
    .select('id')
    .eq('project_id', projectId)
    .eq('created_by', userId)
    .limit(1);

  if (error) return false;
  return Array.isArray(data) && data.length > 0;
}

export async function fetchUserRunScope(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('analysis_runs')
    .select('id, project_id')
    .eq('created_by', userId);

  if (error || !data) {
    return { runIds: [], projectIds: [] };
  }

  const runIds = data.map((row) => row.id).filter(Boolean);
  const projectIds = Array.from(
    new Set(data.map((row) => row.project_id).filter(Boolean)),
  );

  return { runIds, projectIds };
}

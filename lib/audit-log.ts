import type { SupabaseClient } from '@supabase/supabase-js';

export type AuditEvent = {
  action: string;
  entity_type: string;
  entity_id?: string | null;
  project_id?: string | null;
  analysis_run_id?: string | null;
  trace_id?: string | null;
  asset_id?: string | null;
  insight_id?: string | null;
  export_id?: string | null;
  request_id?: string | null;
  input_hash?: string | null;
  output_hash?: string | null;
  diff?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  actor_id?: string | null;
  actor_email?: string | null;
  actor_role?: string | null;
  occurred_at?: string | null;
};

export async function writeAuditLog(supabase: SupabaseClient, event: AuditEvent) {
  const { error } = await supabase.from('audit_logs').insert({
    action: event.action,
    entity_type: event.entity_type,
    entity_id: event.entity_id ?? null,
    project_id: event.project_id ?? null,
    analysis_run_id: event.analysis_run_id ?? null,
    trace_id: event.trace_id ?? null,
    asset_id: event.asset_id ?? null,
    insight_id: event.insight_id ?? null,
    export_id: event.export_id ?? null,
    request_id: event.request_id ?? null,
    input_hash: event.input_hash ?? null,
    output_hash: event.output_hash ?? null,
    diff: event.diff ?? null,
    metadata: event.metadata ?? null,
    actor_id: event.actor_id ?? null,
    actor_email: event.actor_email ?? null,
    actor_role: event.actor_role ?? null,
    occurred_at: event.occurred_at ?? new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

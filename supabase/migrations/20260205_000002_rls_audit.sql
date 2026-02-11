-- Enable RLS + policies for governance tables

alter table public.analysis_runs enable row level security;
create policy "analysis_runs_select" on public.analysis_runs
for select using (created_by = auth.uid());
create policy "analysis_runs_insert" on public.analysis_runs
for insert with check (created_by = auth.uid());
create policy "analysis_runs_update" on public.analysis_runs
for update using (created_by = auth.uid());

alter table public.analysis_traceability enable row level security;
create policy "analysis_traceability_select" on public.analysis_traceability
for select using (
  exists (
    select 1 from public.analysis_runs ar
    where ar.id = analysis_run_id
      and ar.created_by = auth.uid()
  )
);

alter table public.audit_logs enable row level security;
create policy "audit_logs_select_self" on public.audit_logs
for select using (actor_id = auth.uid());
create policy "audit_logs_insert_service" on public.audit_logs
for insert with check (auth.role() = 'service_role');

-- Simple hash-chaining for audit logs
create or replace function public.audit_log_set_hash()
returns trigger
language plpgsql
as $$
declare
  last_hash text;
begin
  select hash into last_hash
  from public.audit_logs
  order by id desc
  limit 1;

  new.prev_hash := last_hash;
  new.hash := encode(
    digest(
      coalesce(new.prev_hash, '') || '|' ||
      coalesce(new.action, '') || '|' ||
      coalesce(new.entity_type, '') || '|' ||
      coalesce(new.entity_id, '') || '|' ||
      coalesce(new.occurred_at::text, ''),
      'sha256'
    ),
    'hex'
  );
  return new;
end;
$$;

drop trigger if exists audit_log_hash_chain on public.audit_logs;
create trigger audit_log_hash_chain
before insert on public.audit_logs
for each row
execute function public.audit_log_set_hash();

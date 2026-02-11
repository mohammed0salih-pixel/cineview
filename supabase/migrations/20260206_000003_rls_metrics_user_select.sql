-- RLS: allow users to read only their project data (based on analysis_runs ownership)

alter table public.usage_metrics enable row level security;
alter table public.kpi_snapshots enable row level security;

drop policy if exists "usage_metrics_service_only" on public.usage_metrics;
drop policy if exists "kpi_snapshots_service_only" on public.kpi_snapshots;
drop policy if exists "usage_metrics_select_own" on public.usage_metrics;
drop policy if exists "kpi_snapshots_select_own" on public.kpi_snapshots;
drop policy if exists "usage_metrics_write_service" on public.usage_metrics;
drop policy if exists "kpi_snapshots_write_service" on public.kpi_snapshots;

create policy "usage_metrics_select_own" on public.usage_metrics
for select using (
  exists (
    select 1
    from public.analysis_runs ar
    where ar.id = usage_metrics.analysis_run_id
      and ar.created_by = auth.uid()
  )
  or exists (
    select 1
    from public.analysis_runs ar
    where ar.project_id = usage_metrics.project_id
      and ar.created_by = auth.uid()
  )
);

create policy "kpi_snapshots_select_own" on public.kpi_snapshots
for select using (
  exists (
    select 1
    from public.analysis_runs ar
    where ar.project_id = kpi_snapshots.project_id
      and ar.created_by = auth.uid()
  )
);

create policy "usage_metrics_write_service" on public.usage_metrics
for insert with check (auth.role() = 'service_role');
create policy "usage_metrics_write_service_update" on public.usage_metrics
for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "usage_metrics_write_service_delete" on public.usage_metrics
for delete using (auth.role() = 'service_role');

create policy "kpi_snapshots_write_service" on public.kpi_snapshots
for insert with check (auth.role() = 'service_role');
create policy "kpi_snapshots_write_service_update" on public.kpi_snapshots
for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "kpi_snapshots_write_service_delete" on public.kpi_snapshots
for delete using (auth.role() = 'service_role');

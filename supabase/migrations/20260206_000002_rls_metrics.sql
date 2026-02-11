-- RLS coverage for metrics tables (service-role only access)

alter table public.usage_metrics enable row level security;
create policy "usage_metrics_service_only" on public.usage_metrics
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

alter table public.kpi_snapshots enable row level security;
create policy "kpi_snapshots_service_only" on public.kpi_snapshots
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Enforce project ownership on analysis_runs inserts/updates

drop policy if exists "analysis_runs_insert" on public.analysis_runs;
drop policy if exists "analysis_runs_update" on public.analysis_runs;

create policy "analysis_runs_insert" on public.analysis_runs
for insert with check (
  created_by = auth.uid()
  and (
    project_id is null
    or exists (
      select 1 from public.projects p
      where p.id = analysis_runs.project_id
        and p.owner_id = auth.uid()
    )
  )
);

create policy "analysis_runs_update" on public.analysis_runs
for update using (
  created_by = auth.uid()
  and (
    project_id is null
    or exists (
      select 1 from public.projects p
      where p.id = analysis_runs.project_id
        and p.owner_id = auth.uid()
    )
  )
);

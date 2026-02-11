-- RLS policies for core entities

alter table public.projects enable row level security;
create policy "projects_select_own" on public.projects
for select using (owner_id = auth.uid());
create policy "projects_insert_own" on public.projects
for insert with check (owner_id = auth.uid());
create policy "projects_update_own" on public.projects
for update using (owner_id = auth.uid());
create policy "projects_delete_own" on public.projects
for delete using (owner_id = auth.uid());

alter table public.media enable row level security;
create policy "media_select_own" on public.media
for select using (
  exists (
    select 1 from public.projects p
    where p.id = media.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "media_insert_own" on public.media
for insert with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.projects p
    where p.id = media.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "media_update_own" on public.media
for update using (
  exists (
    select 1 from public.projects p
    where p.id = media.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "media_delete_own" on public.media
for delete using (
  exists (
    select 1 from public.projects p
    where p.id = media.project_id
      and p.owner_id = auth.uid()
  )
);

alter table public.creative_insights enable row level security;
create policy "creative_insights_select_own" on public.creative_insights
for select using (
  exists (
    select 1 from public.projects p
    where p.id = creative_insights.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "creative_insights_insert_own" on public.creative_insights
for insert with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.projects p
    where p.id = creative_insights.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "creative_insights_update_own" on public.creative_insights
for update using (
  exists (
    select 1 from public.projects p
    where p.id = creative_insights.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "creative_insights_delete_own" on public.creative_insights
for delete using (
  exists (
    select 1 from public.projects p
    where p.id = creative_insights.project_id
      and p.owner_id = auth.uid()
  )
);

alter table public.storyboards enable row level security;
create policy "storyboards_select_own" on public.storyboards
for select using (
  exists (
    select 1 from public.projects p
    where p.id = storyboards.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "storyboards_insert_own" on public.storyboards
for insert with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.projects p
    where p.id = storyboards.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "storyboards_update_own" on public.storyboards
for update using (
  exists (
    select 1 from public.projects p
    where p.id = storyboards.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "storyboards_delete_own" on public.storyboards
for delete using (
  exists (
    select 1 from public.projects p
    where p.id = storyboards.project_id
      and p.owner_id = auth.uid()
  )
);

alter table public.moodboards enable row level security;
create policy "moodboards_select_own" on public.moodboards
for select using (
  exists (
    select 1 from public.projects p
    where p.id = moodboards.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "moodboards_insert_own" on public.moodboards
for insert with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.projects p
    where p.id = moodboards.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "moodboards_update_own" on public.moodboards
for update using (
  exists (
    select 1 from public.projects p
    where p.id = moodboards.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "moodboards_delete_own" on public.moodboards
for delete using (
  exists (
    select 1 from public.projects p
    where p.id = moodboards.project_id
      and p.owner_id = auth.uid()
  )
);

alter table public.exports enable row level security;
create policy "exports_select_own" on public.exports
for select using (
  exists (
    select 1 from public.projects p
    where p.id = exports.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "exports_insert_own" on public.exports
for insert with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.projects p
    where p.id = exports.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "exports_update_own" on public.exports
for update using (
  exists (
    select 1 from public.projects p
    where p.id = exports.project_id
      and p.owner_id = auth.uid()
  )
);
create policy "exports_delete_own" on public.exports
for delete using (
  exists (
    select 1 from public.projects p
    where p.id = exports.project_id
      and p.owner_id = auth.uid()
  )
);

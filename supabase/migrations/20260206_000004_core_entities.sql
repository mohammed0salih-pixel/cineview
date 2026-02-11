-- Core entities: projects, media, insights, storyboards, moodboards, exports

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'active',
  owner_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create index if not exists projects_owner_idx on public.projects(owner_id);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null,
  media_type text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  duration_seconds numeric(10,2),
  checksum text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_media_updated_at on public.media;
create trigger set_media_updated_at
before update on public.media
for each row
execute function public.set_updated_at();

create index if not exists media_project_idx on public.media(project_id);
create index if not exists media_created_by_idx on public.media(created_by);

create table if not exists public.creative_insights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  analysis_run_id uuid references public.analysis_runs(id) on delete set null,
  media_id uuid references public.media(id) on delete set null,
  summary text,
  insights jsonb not null default '{}'::jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_creative_insights_updated_at on public.creative_insights;
create trigger set_creative_insights_updated_at
before update on public.creative_insights
for each row
execute function public.set_updated_at();

create index if not exists creative_insights_project_idx on public.creative_insights(project_id);
create index if not exists creative_insights_run_idx on public.creative_insights(analysis_run_id);
create index if not exists creative_insights_media_idx on public.creative_insights(media_id);
create index if not exists creative_insights_created_by_idx on public.creative_insights(created_by);

create table if not exists public.storyboards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  frames jsonb not null default '[]'::jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_storyboards_updated_at on public.storyboards;
create trigger set_storyboards_updated_at
before update on public.storyboards
for each row
execute function public.set_updated_at();

create index if not exists storyboards_project_idx on public.storyboards(project_id);
create index if not exists storyboards_created_by_idx on public.storyboards(created_by);

create table if not exists public.moodboards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  items jsonb not null default '[]'::jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_moodboards_updated_at on public.moodboards;
create trigger set_moodboards_updated_at
before update on public.moodboards
for each row
execute function public.set_updated_at();

create index if not exists moodboards_project_idx on public.moodboards(project_id);
create index if not exists moodboards_created_by_idx on public.moodboards(created_by);

create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  analysis_run_id uuid references public.analysis_runs(id) on delete set null,
  media_id uuid references public.media(id) on delete set null,
  export_type text not null,
  format text,
  storage_path text,
  created_by uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists exports_project_idx on public.exports(project_id);
create index if not exists exports_run_idx on public.exports(analysis_run_id);
create index if not exists exports_media_idx on public.exports(media_id);
create index if not exists exports_created_by_idx on public.exports(created_by);

-- Relational links to core entities
alter table public.analysis_runs
  add constraint analysis_runs_project_fk
  foreign key (project_id) references public.projects(id) on delete set null;

alter table public.analysis_runs
  add constraint analysis_runs_media_fk
  foreign key (asset_id) references public.media(id) on delete set null;

alter table public.analysis_traceability
  add constraint analysis_traceability_insight_fk
  foreign key (insight_id) references public.creative_insights(id) on delete set null;

alter table public.analysis_traceability
  add constraint analysis_traceability_export_fk
  foreign key (export_id) references public.exports(id) on delete set null;

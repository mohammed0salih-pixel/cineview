-- Harden analysis_runs ownership integrity
-- Backfill created_by from projects when missing
update public.analysis_runs ar
set created_by = p.owner_id
from public.projects p
where ar.project_id = p.id
  and ar.created_by is null;

-- Abort if any rows still missing created_by
DO $$
BEGIN
  IF EXISTS (select 1 from public.analysis_runs where created_by is null) THEN
    RAISE EXCEPTION 'analysis_runs.created_by has nulls; cannot enforce NOT NULL';
  END IF;
END $$;

-- Enforce NOT NULL and FK to auth.users
alter table public.analysis_runs
  alter column created_by set not null;

alter table public.analysis_runs
  add constraint analysis_runs_created_by_fk
  foreign key (created_by) references auth.users(id) on delete restrict;

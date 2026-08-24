-- Private screening feedback: written by a viewer, readable only by that
-- viewer (served through the app) and screening administrators.
create table if not exists public.screening_feedback (
  id uuid primary key default gen_random_uuid(),
  viewer_id uuid not null references public.screening_viewers(id) on delete cascade,
  episode_id uuid not null references public.screening_episodes(id) on delete cascade,
  timecode_seconds integer check (timecode_seconds >= 0),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists screening_feedback_viewer_idx
  on public.screening_feedback (viewer_id, created_at desc);
create index if not exists screening_feedback_created_idx
  on public.screening_feedback (created_at desc);

-- RLS enabled with no policies: browser clients (anon or authenticated) can
-- neither read nor write any row. Only the server-side service-role client
-- touches this table, and it scopes every viewer read to the signed-in viewer,
-- so a note stays between its writer and the administration desk.
alter table public.screening_feedback enable row level security;

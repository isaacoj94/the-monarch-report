alter table if exists public.screening_viewers
  add column if not exists context_note text,
  add column if not exists access_key text;

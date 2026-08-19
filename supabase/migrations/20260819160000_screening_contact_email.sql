alter table if exists public.screening_viewers
  add column if not exists contact_email text;

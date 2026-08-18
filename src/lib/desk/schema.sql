-- Optional managed Postgres target. The live collector writes JSON until DATABASE_URL exists.
-- Do not connect this from Vercel request handlers.

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  handle TEXT,
  name TEXT NOT NULL,
  url TEXT,
  country TEXT,
  language TEXT,
  kind TEXT NOT NULL,
  ownership TEXT,
  relationships TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS raw_items (
  id TEXT PRIMARY KEY,
  collected_at TIMESTAMPTZ NOT NULL,
  collector TEXT NOT NULL,
  beat TEXT,
  post_id TEXT UNIQUE,
  article_id TEXT,
  url TEXT,
  handle TEXT,
  posted_at TIMESTAMPTZ,
  lang TEXT,
  text TEXT NOT NULL,
  has_article BOOLEAN DEFAULT FALSE,
  media JSONB,
  review_state TEXT NOT NULL DEFAULT 'inbox',
  seen_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL,
  review_state TEXT NOT NULL DEFAULT 'inbox',
  urgency TEXT NOT NULL DEFAULT 'normal',
  location TEXT,
  event_time TIMESTAMPTZ,
  people TEXT[] NOT NULL DEFAULT '{}',
  organizations TEXT[] NOT NULL DEFAULT '{}',
  individual_impact TEXT,
  company_impact TEXT,
  impact_tags TEXT[] NOT NULL DEFAULT '{}',
  known TEXT,
  unverified TEXT,
  counterclaims TEXT,
  source_urls TEXT[] NOT NULL DEFAULT '{}',
  post_ids TEXT[] NOT NULL DEFAULT '{}',
  last_checked_at TIMESTAMPTZ NOT NULL,
  extraction JSONB,
  challenge JSONB
);

CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id),
  text TEXT NOT NULL,
  kind TEXT NOT NULL,
  verdict TEXT NOT NULL DEFAULT 'unchecked',
  needs_human BOOLEAN NOT NULL DEFAULT TRUE,
  sources TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  decision TEXT NOT NULL,
  editor TEXT,
  note TEXT,
  decided_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS corrections (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS raw_items_review_idx ON raw_items (review_state, collected_at DESC);
CREATE INDEX IF NOT EXISTS events_review_idx ON events (review_state, last_checked_at DESC);

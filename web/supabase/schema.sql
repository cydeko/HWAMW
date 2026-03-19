-- HWAMW Database Schema
-- Run this in the Supabase SQL editor

create table participants (
  id uuid primary key default gen_random_uuid(),
  pid text unique not null,
  condition text not null check (condition in ('narrative-structures', 'narrative-techniques')),
  assigned_windows text[] not null,
  status text not null default 'consent' check (status in (
    'consent', 'troubles', 'qualities', 'quality_description',
    'pre_narrative', 'characters', 'motivations', 't1_meaning',
    'in_house', 'post_narrative', 't2_meaning', 'complete'
  )),
  created_at timestamptz default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references participants(id) on delete cascade,
  trouble text[] default '{}',
  qualities text[] default '{}',
  quality_description text,
  t1_narrative text,
  plot_summary text,
  characters jsonb default '[]',
  motivations text[] default '{}',
  motivation_description text,
  t1_meaning_score int check (t1_meaning_score between 1 and 7),
  participant_name text,
  t2_narrative text,
  t2_meaning_score int check (t2_meaning_score between 1 and 7),
  consent_given boolean default false,
  consent_timestamp timestamptz,
  consent_version text default 'v1'
);

create table window_sessions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references participants(id) on delete cascade,
  window_name text not null,
  window_category text not null,
  order_in_session int not null check (order_in_session in (1, 2, 3)),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'complete')),
  llm_passages jsonb default '[]',
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table flavor_choices (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references participants(id) on delete cascade,
  fork_id text not null,
  choice text not null,
  created_at timestamptz default now()
);

create table questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references participants(id) on delete cascade,
  questionnaire text not null check (questionnaire in ('MEMS', 'MLQ', 'PTGI', 'NISE')),
  timing text not null check (timing in ('pre', 'post')),
  responses jsonb not null default '{}',
  created_at timestamptz default now()
);

-- Indexes for common lookups
create index on participants(pid);
create index on sessions(participant_id);
create index on window_sessions(participant_id);

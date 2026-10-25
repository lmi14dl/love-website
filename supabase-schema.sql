-- One Little Question ❤️ — Database Schema
-- Run this in the Supabase SQL Editor

-- Create the table
create table if not exists public.love_requests (
  id text primary key,
  title text not null,
  question text not null,
  subtitle text,
  sad_gif_url text,
  happy_gif_url text,
  yes_message text,
  yes_button_text text not null default 'آرههه، قبول! ❤️',
  no_button_text text not null default 'نه 🙈',
  theme text not null default 'pink-romance',
  accent_color text,
  sender_name text,
  intro_message text,
  final_message text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  yes_count integer not null default 0,
  no_count integer not null default 0,
  edit_token text not null
);

-- Index for cleanup of expired rows (optional)
create index if not exists love_requests_expires_at_idx
  on public.love_requests (expires_at)
  where expires_at is not null;

-- Row Level Security
alter table public.love_requests enable row level security;

-- Public can only SELECT a single row by id (no listing)
create policy "Public can read single request by id"
  on public.love_requests
  for select
  using (true);

-- Only service role / server can insert (we use service role key on server)
-- No public insert policy — all writes go through Next.js API routes

-- Optional: helper RPC for atomic increment (run if you want)
create or replace function increment_yes(request_id text)
returns void
language plpgsql
security definer
as $$
begin
  update public.love_requests
  set yes_count = yes_count + 1
  where id = request_id;
end;
$$;

create or replace function increment_no(request_id text)
returns void
language plpgsql
security definer
as $$
begin
  update public.love_requests
  set no_count = no_count + 1
  where id = request_id;
end;
$$;

-- Optional: storage bucket for GIF uploads (if you add file upload later)
-- insert into storage.buckets (id, name, public) values ('gifs', 'gifs', true);

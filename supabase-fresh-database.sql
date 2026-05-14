-- SimpleVote - fresh Supabase database setup
-- Run this once in Supabase Dashboard > SQL Editor for a new project.

create extension if not exists pgcrypto;

drop view if exists votes_count;
do $$
begin
  if to_regclass('public.polls') is not null then
    drop trigger if exists update_polls_updated_at on public.polls;
  end if;

  if to_regclass('public.company_settings') is not null then
    drop trigger if exists update_company_settings_updated_at on public.company_settings;
  end if;
end $$;
drop function if exists public.update_updated_at_column();
drop function if exists public.get_user_total_votes(uuid);
drop function if exists public.get_user_plan(uuid);
drop function if exists public.check_vote_limit(uuid);

drop table if exists public.votes;
drop table if exists public.poll_options;
drop table if exists public.polls;
drop table if exists public.company_settings;
drop table if exists public.subscriptions;

create table public.polls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  user_id uuid references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  display_settings jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  text text not null,
  color text not null,
  order_index integer not null
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  voter_fingerprint text not null,
  created_at timestamptz not null default now(),
  unique (poll_id, voter_fingerprint)
);

create table public.company_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text,
  company_logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_polls_created_at on public.polls(created_at desc);
create index idx_polls_user_id on public.polls(user_id);
create index idx_poll_options_poll_id on public.poll_options(poll_id);
create index idx_votes_poll_id on public.votes(poll_id);
create index idx_votes_option_id on public.votes(option_id);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);

create view public.votes_count as
select
  poll_id,
  option_id,
  count(*) as count
from public.votes
group by poll_id, option_id;

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_polls_updated_at
  before update on public.polls
  for each row
  execute function public.update_updated_at_column();

create trigger update_company_settings_updated_at
  before update on public.company_settings
  for each row
  execute function public.update_updated_at_column();

insert into public.company_settings (company_name)
values ('My Company');

alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes enable row level security;
alter table public.company_settings enable row level security;
alter table public.subscriptions enable row level security;

create policy "Anyone can read active polls"
on public.polls for select
using (is_active = true or auth.uid() = user_id);

create policy "Users can create their own polls"
on public.polls for insert
with check (auth.uid() = user_id);

create policy "Users can update their own polls"
on public.polls for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own polls"
on public.polls for delete
using (auth.uid() = user_id);

create policy "Anyone can read active poll options"
on public.poll_options for select
using (
  exists (
    select 1
    from public.polls
    where polls.id = poll_options.poll_id
      and (polls.is_active = true or polls.user_id = auth.uid())
  )
);

create policy "Users can create options for their polls"
on public.poll_options for insert
with check (
  exists (
    select 1
    from public.polls
    where polls.id = poll_options.poll_id
      and polls.user_id = auth.uid()
  )
);

create policy "Users can update options for their polls"
on public.poll_options for update
using (
  exists (
    select 1
    from public.polls
    where polls.id = poll_options.poll_id
      and polls.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.polls
    where polls.id = poll_options.poll_id
      and polls.user_id = auth.uid()
  )
);

create policy "Users can delete options for their polls"
on public.poll_options for delete
using (
  exists (
    select 1
    from public.polls
    where polls.id = poll_options.poll_id
      and polls.user_id = auth.uid()
  )
);

create policy "Anyone can read votes for active polls"
on public.votes for select
using (
  exists (
    select 1
    from public.polls
    where polls.id = votes.poll_id
      and (polls.is_active = true or polls.user_id = auth.uid())
  )
);

create policy "Anyone can vote on active polls"
on public.votes for insert
with check (
  exists (
    select 1
    from public.polls
    where polls.id = votes.poll_id
      and polls.is_active = true
  )
);

create policy "Users can manage votes for their polls"
on public.votes for all
using (
  exists (
    select 1
    from public.polls
    where polls.id = votes.poll_id
      and polls.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.polls
    where polls.id = votes.poll_id
      and polls.user_id = auth.uid()
  )
);

create policy "Anyone can read company settings"
on public.company_settings for select
using (true);

create policy "Authenticated users can manage company settings"
on public.company_settings for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Users can view their own subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id);

create policy "Authenticated users can manage subscriptions"
on public.subscriptions for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create or replace function public.get_user_total_votes(user_uuid uuid)
returns integer as $$
declare
  total_votes integer;
begin
  select count(v.id) into total_votes
  from public.votes v
  join public.poll_options po on v.option_id = po.id
  join public.polls p on po.poll_id = p.id
  where p.user_id = user_uuid;

  return coalesce(total_votes, 0);
end;
$$ language plpgsql security definer;

create or replace function public.get_user_plan(user_uuid uuid)
returns text as $$
declare
  user_plan text;
begin
  select plan into user_plan
  from public.subscriptions
  where user_id = user_uuid and status = 'active'
  order by created_at desc
  limit 1;

  return coalesce(user_plan, 'free');
end;
$$ language plpgsql security definer;

create or replace function public.check_vote_limit(user_uuid uuid)
returns boolean as $$
declare
  current_votes integer;
  user_plan text;
  vote_limit integer;
begin
  current_votes := public.get_user_total_votes(user_uuid);
  user_plan := public.get_user_plan(user_uuid);

  case user_plan
    when 'free' then vote_limit := 5;
    when 'pro' then vote_limit := 25;
    when 'enterprise' then vote_limit := 999999;
    else vote_limit := 5;
  end case;

  return current_votes < vote_limit;
end;
$$ language plpgsql security definer;

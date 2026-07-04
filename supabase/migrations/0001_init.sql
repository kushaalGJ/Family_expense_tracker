-- FamilySpend initial schema: tables, RLS policies, and onboarding RPCs.
-- Run this once via the Supabase SQL Editor (or `supabase db push` if the CLI is linked).

create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete cascade
);

-- One row per (auth user, family): the family-scoped profile (name/emoji/color
-- chosen at join time), distinct from the auth.users login identity.
-- Presence of a row here = "family mode" for that user; absence = "private mode".
create table family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text not null default '🙂',
  color text not null default '#8B5CF6',
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  category text not null check (category in
    ('Food','Transport','Shopping','Bills','Health','Entertainment','Education','Other')),
  note text not null default '',
  date date not null default current_date,
  is_shared boolean not null default false,
  is_recurring boolean not null default false,
  created_at timestamptz not null default now()
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  category text not null check (category in
    ('Food','Transport','Shopping','Bills','Health','Entertainment','Education','Other')),
  monthly_limit numeric(12,2) not null check (monthly_limit >= 0),
  created_at timestamptz not null default now()
);

-- Postgres treats NULL as distinct from NULL in a plain UNIQUE constraint, so a
-- normal `unique (user_id, family_id, category)` would not stop duplicate rows
-- for private-mode budgets (family_id always null there). Two partial unique
-- indexes cover both cases correctly.
create unique index budgets_private_uidx on budgets(user_id, category) where family_id is null;
create unique index budgets_family_uidx on budgets(user_id, family_id, category) where family_id is not null;

create table income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  source text not null default '',
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target numeric(12,2) not null check (target > 0),
  saved numeric(12,2) not null default 0 check (saved >= 0),
  deadline date,
  created_at timestamptz not null default now()
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  amount numeric(12,2) not null check (amount > 0),
  due_day int not null check (due_day between 1 and 28),
  category text not null check (category in
    ('Food','Transport','Shopping','Bills','Health','Entertainment','Education','Other')),
  created_at timestamptz not null default now()
);

create index idx_expenses_user on expenses(user_id);
create index idx_expenses_family on expenses(family_id);
create index idx_expenses_date on expenses(date);
create index idx_budgets_user on budgets(user_id);
create index idx_income_user on income(user_id);
create index idx_income_family on income(family_id);
create index idx_family_members_family on family_members(family_id);
create index idx_family_members_user on family_members(user_id);
create index idx_goals_user on goals(user_id);
create index idx_reminders_user on reminders(user_id);

-- ============================================================
-- HELPER: is the current user a member of this family?
-- security definer so it can read family_members from within RLS
-- policies on other tables without recursive-RLS issues.
-- ============================================================

create or replace function is_family_member(target_family_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from family_members
    where family_id = target_family_id
      and user_id = auth.uid()
  );
$$;

-- ============================================================
-- ONBOARDING RPCs
-- ============================================================

create or replace function generate_family_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- excludes O/0/I/1 for readability
  result text;
  i int;
  code_exists boolean;
begin
  loop
    result := '';
    for i in 1..6 loop
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    end loop;
    select exists(select 1 from families where code = result) into code_exists;
    exit when not code_exists;
  end loop;
  return result;
end;
$$;

-- Atomically creates a family + the creator's family_members row, so a
-- family row can never exist without an owning member row.
create or replace function create_family_with_owner(
  family_name text,
  owner_name text,
  owner_emoji text,
  owner_color text
)
returns families
language plpgsql
security definer
as $$
declare
  new_family families;
  new_code text;
begin
  new_code := generate_family_code();
  insert into families (name, code, created_by)
    values (family_name, new_code, auth.uid())
    returning * into new_family;

  insert into family_members (family_id, user_id, name, emoji, color)
    values (new_family.id, auth.uid(), owner_name, owner_emoji, owner_color);

  return new_family;
end;
$$;

-- Validates a join code and creates (or updates) the joining user's
-- family_members row. Raises INVALID_CODE if no family matches.
create or replace function join_family_by_code(
  join_code text,
  member_name text,
  member_emoji text,
  member_color text
)
returns families
language plpgsql
security definer
as $$
declare
  target_family families;
begin
  select * into target_family from families where code = upper(join_code);
  if target_family.id is null then
    raise exception 'INVALID_CODE';
  end if;

  insert into family_members (family_id, user_id, name, emoji, color)
    values (target_family.id, auth.uid(), member_name, member_emoji, member_color)
    on conflict (family_id, user_id) do update
      set name = excluded.name, emoji = excluded.emoji, color = excluded.color;

  return target_family;
end;
$$;

grant execute on function is_family_member to authenticated;
grant execute on function generate_family_code to authenticated;
grant execute on function create_family_with_owner to authenticated;
grant execute on function join_family_by_code to authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table families enable row level security;
alter table family_members enable row level security;
alter table expenses enable row level security;
alter table budgets enable row level security;
alter table income enable row level security;
alter table goals enable row level security;
alter table reminders enable row level security;

-- families: readable by members and by the creator; direct inserts require
-- created_by = self (normal flow goes through create_family_with_owner,
-- which runs as security definer and bypasses this anyway)
create policy "families_select_member" on families
  for select using ( is_family_member(id) or created_by = auth.uid() );

create policy "families_insert_self" on families
  for insert with check ( created_by = auth.uid() );

-- family_members: members can see all profiles within their own family(ies)
create policy "family_members_select" on family_members
  for select using ( is_family_member(family_id) );

create policy "family_members_insert_self" on family_members
  for insert with check ( user_id = auth.uid() );

create policy "family_members_update_self" on family_members
  for update using ( user_id = auth.uid() );

create policy "family_members_delete_self" on family_members
  for delete using ( user_id = auth.uid() );

-- expenses: own rows, or shared rows belonging to a family you're in.
-- "with check" on update/insert prevents a user from ever writing a row
-- with someone else's user_id, or reassigning family_id to a family they're not in.
create policy "expenses_select" on expenses
  for select using (
    user_id = auth.uid() or (family_id is not null and is_family_member(family_id))
  );
create policy "expenses_insert" on expenses
  for insert with check (
    user_id = auth.uid() and (family_id is null or is_family_member(family_id))
  );
create policy "expenses_update" on expenses
  for update using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() and (family_id is null or is_family_member(family_id)) );
create policy "expenses_delete" on expenses
  for delete using ( user_id = auth.uid() );

-- budgets: same own-or-family pattern as expenses
create policy "budgets_select" on budgets
  for select using (
    user_id = auth.uid() or (family_id is not null and is_family_member(family_id))
  );
create policy "budgets_insert" on budgets
  for insert with check (
    user_id = auth.uid() and (family_id is null or is_family_member(family_id))
  );
create policy "budgets_update" on budgets
  for update using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() and (family_id is null or is_family_member(family_id)) );
create policy "budgets_delete" on budgets
  for delete using ( user_id = auth.uid() );

-- income: same own-or-family pattern as expenses
create policy "income_select" on income
  for select using (
    user_id = auth.uid() or (family_id is not null and is_family_member(family_id))
  );
create policy "income_insert" on income
  for insert with check (
    user_id = auth.uid() and (family_id is null or is_family_member(family_id))
  );
create policy "income_update" on income
  for update using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() and (family_id is null or is_family_member(family_id)) );
create policy "income_delete" on income
  for delete using ( user_id = auth.uid() );

-- goals: always private to the user, never shared with a family
create policy "goals_select" on goals for select using ( user_id = auth.uid() );
create policy "goals_insert" on goals for insert with check ( user_id = auth.uid() );
create policy "goals_update" on goals for update using ( user_id = auth.uid() ) with check ( user_id = auth.uid() );
create policy "goals_delete" on goals for delete using ( user_id = auth.uid() );

-- reminders: always private to the user, never shared with a family
create policy "reminders_select" on reminders for select using ( user_id = auth.uid() );
create policy "reminders_insert" on reminders for insert with check ( user_id = auth.uid() );
create policy "reminders_update" on reminders for update using ( user_id = auth.uid() ) with check ( user_id = auth.uid() );
create policy "reminders_delete" on reminders for delete using ( user_id = auth.uid() );

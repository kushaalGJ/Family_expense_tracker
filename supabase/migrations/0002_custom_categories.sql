-- FamilySpend migration 0002: custom categories, payment method, attachments.
-- Additive only — no existing data is modified or removed.
-- Run once in the Supabase SQL Editor.

-- ============================================================
-- 1. Custom categories
-- ============================================================
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  name text not null,
  icon text not null default 'Package',
  color text not null default '#6B7280',
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_user on categories(user_id);
create index if not exists idx_categories_family on categories(family_id);

alter table categories enable row level security;

create policy "categories_select" on categories
  for select using (
    user_id = auth.uid() or (family_id is not null and is_family_member(family_id))
  );
create policy "categories_insert" on categories
  for insert with check (
    user_id = auth.uid() and (family_id is null or is_family_member(family_id))
  );
create policy "categories_update" on categories
  for update using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() and (family_id is null or is_family_member(family_id)) );
create policy "categories_delete" on categories
  for delete using ( user_id = auth.uid() );

-- Custom category names must be allowed on expense/budget/reminder rows, so the
-- fixed-list CHECK constraints from 0001 are dropped. Category is still text.
alter table expenses  drop constraint if exists expenses_category_check;
alter table budgets   drop constraint if exists budgets_category_check;
alter table reminders drop constraint if exists reminders_category_check;

-- ============================================================
-- 2. Payment method + attachment on expenses
-- ============================================================
alter table expenses add column if not exists payment_method text;
alter table expenses add column if not exists attachment_url text;

-- ============================================================
-- 3. Receipts storage bucket + policies
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('receipts', 'receipts', true)
  on conflict (id) do nothing;

drop policy if exists "receipts_read" on storage.objects;
create policy "receipts_read" on storage.objects
  for select using ( bucket_id = 'receipts' );

drop policy if exists "receipts_insert" on storage.objects;
create policy "receipts_insert" on storage.objects
  for insert to authenticated
  with check ( bucket_id = 'receipts' and owner = auth.uid() );

drop policy if exists "receipts_delete" on storage.objects;
create policy "receipts_delete" on storage.objects
  for delete to authenticated
  using ( bucket_id = 'receipts' and owner = auth.uid() );

-- FamilySpend migration 0003: self-service account deletion.
-- Deleting from auth.users requires elevated privileges, so this runs as a
-- security-definer function scoped to the caller's own row. All the user's
-- data is removed by the existing ON DELETE CASCADE foreign keys.
-- Run once in the Supabase SQL Editor.

create or replace function delete_current_user()
returns void
language sql
security definer
as $$
  delete from auth.users where id = auth.uid();
$$;

grant execute on function delete_current_user to authenticated;

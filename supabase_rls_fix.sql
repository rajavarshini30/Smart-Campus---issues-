-- 1. DROP the previous recursive policy that caused the 500 error
drop policy if exists "profiles_admin_read" on public.profiles;

-- 2. Create a secure function that bypasses RLS to check if the user is an admin 
--    and get their university_id without causing an infinite loop
create or replace function public.admin_university_id()
returns text
language sql
security definer -- This allows the function to bypass RLS
set search_path = public
as $$
  select university_id from profiles where id = auth.uid() and role = 'admin' limit 1;
$$;

-- 3. Create the safe policy using the new function
create policy "profiles_admin_read" on public.profiles for select
using (
  public.admin_university_id() = university_id
);

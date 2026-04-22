-- Fix infinite recursion in RLS policies
-- The admin policies on profiles were self-referencing (SELECT from profiles to check admin role),
-- causing infinite recursion. Fix: use a SECURITY DEFINER function that bypasses RLS.

-- Helper function to check if current user is admin (bypasses RLS)
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Drop recursive policies
drop policy if exists "Admins read all profiles" on profiles;
drop policy if exists "Admins read all vehicles" on vehicles;
drop policy if exists "Admins manage all bookings" on bookings;
drop policy if exists "Admins manage all reviews" on reviews;
drop policy if exists "Admins read messages" on contact_messages;
drop policy if exists "Admins manage all referrals" on referrals;
drop policy if exists "Admins manage services" on services;

-- Recreate with is_admin() function (no recursion)
create policy "Admins read all profiles" on profiles for select using (is_admin());
create policy "Admins update all profiles" on profiles for update using (is_admin());
create policy "Admins read all vehicles" on vehicles for select using (is_admin());
create policy "Admins manage all bookings" on bookings for all using (is_admin());
create policy "Admins manage all reviews" on reviews for all using (is_admin());
create policy "Admins read messages" on contact_messages for select using (is_admin());
create policy "Admins manage all referrals" on referrals for all using (is_admin());
create policy "Admins manage services" on services for all using (is_admin());

-- Also need INSERT policy on profiles for the trigger (runs as the new user, not admin)
-- The handle_new_user trigger runs as SECURITY DEFINER so it bypasses RLS,
-- but we also need users to be able to insert their own profile if trigger fails
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- Fix handle_new_user trigger to be more robust
-- Possible issues: email could be null in some flows, or NOT NULL constraints failing

-- Drop and recreate the trigger function with better null handling
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
exception when others then
  -- Log but don't block user creation if profile insert fails
  raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

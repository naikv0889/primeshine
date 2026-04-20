-- PrimeShine Detail Co. — Database Schema
-- Run this in Supabase SQL editor or via CLI migrations

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  default_address text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Vehicles
create table vehicles (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  make text not null,
  model text not null,
  year int,
  color text,
  plate text,
  vehicle_type text not null default 'sedan' check (vehicle_type in ('sedan', 'suv', 'truck', 'van')),
  is_primary boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

-- Bookings
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_number text unique not null default ('B-' || lpad(nextval('booking_seq')::text, 4, '0')),
  customer_id uuid not null references profiles(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  service_id text not null,
  addons text[] not null default '{}',
  scheduled_date date not null,
  scheduled_time text not null,
  address text not null,
  city text,
  state text default 'CA',
  zip text,
  status text not null default 'confirmed' check (status in ('confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
  assigned_to text,
  subtotal int not null default 0,
  tax int not null default 0,
  total int not null default 0,
  payment_method text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'authorized', 'captured', 'refunded')),
  stripe_payment_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sequence for booking numbers
create sequence if not exists booking_seq start with 2054;

-- Reviews
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  customer_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  reply text,
  replied_at timestamptz,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Contact messages
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  topic text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table contact_messages enable row level security;

-- Profiles: users see own, admins see all
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins read all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Vehicles: users manage own
create policy "Users manage own vehicles" on vehicles for all using (auth.uid() = owner_id);
create policy "Admins read all vehicles" on vehicles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Bookings: users see own, admins see all
create policy "Users read own bookings" on bookings for select using (auth.uid() = customer_id);
create policy "Users create bookings" on bookings for insert with check (auth.uid() = customer_id);
create policy "Admins manage all bookings" on bookings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Reviews: public read, users create own
create policy "Anyone reads published reviews" on reviews for select using (is_published = true);
create policy "Users create own reviews" on reviews for insert with check (auth.uid() = customer_id);
create policy "Admins manage all reviews" on reviews for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Contact messages: anyone can insert, admins read
create policy "Anyone sends contact message" on contact_messages for insert with check (true);
create policy "Admins read messages" on contact_messages for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Indexes
create index idx_bookings_customer on bookings(customer_id);
create index idx_bookings_date on bookings(scheduled_date);
create index idx_bookings_status on bookings(status);
create index idx_vehicles_owner on vehicles(owner_id);
create index idx_reviews_booking on reviews(booking_id);
create index idx_reviews_customer on reviews(customer_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles for each row execute function update_updated_at();
create trigger set_updated_at before update on bookings for each row execute function update_updated_at();

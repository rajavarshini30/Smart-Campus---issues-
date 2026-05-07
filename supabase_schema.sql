-- ============================================================
-- SMART CAMPUS ISSUE REPORTING SYSTEM – SUPABASE SQL SCHEMA
-- Paste this into: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. UNIVERSITIES TABLE
create table if not exists public.universities (
  id text primary key,
  name text not null,
  city text not null,
  state text not null,
  lat float8 not null,
  lng float8 not null,
  radius_meters int not null default 800,
  created_at timestamptz default now()
);

-- 2. PROFILES TABLE (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  university_id text references public.universities(id),
  role text not null check (role in ('student', 'technician', 'admin')) default 'student',
  created_at timestamptz default now()
);

-- 3. ISSUES TABLE
create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null unique,
  university_id text not null references public.universities(id),
  reported_by uuid not null references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  block text not null,
  room text not null,
  section text not null,
  issue_type text not null,
  description text not null,
  image_url text,
  priority text not null check (priority in ('low', 'medium', 'high')) default 'medium',
  status text not null check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger issues_updated_at
  before update on public.issues
  for each row execute function update_updated_at();

-- 4. ANNOUNCEMENTS TABLE
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  university_id text not null references public.universities(id),
  title text not null,
  body text not null default '',
  created_at timestamptz default now()
);

-- ============================================================
-- SEED UNIVERSITIES
-- ============================================================
insert into public.universities (id, name, city, state, lat, lng, radius_meters) values
  ('um',      'University of Mumbai',                  'Mumbai',        'Maharashtra',     18.9041, 72.8347, 800),
  ('sppu',    'Savitribai Phule Pune University',      'Pune',          'Maharashtra',     18.5204, 73.8567, 1000),
  ('iitb',    'IIT Bombay',                            'Mumbai',        'Maharashtra',     19.1326, 72.9159, 1200),
  ('du',      'University of Delhi',                   'New Delhi',     'Delhi',           28.6970, 77.2070, 1000),
  ('jnu',     'Jawaharlal Nehru University',           'New Delhi',     'Delhi',           28.5413, 77.1673, 900),
  ('iitd',    'IIT Delhi',                             'New Delhi',     'Delhi',           28.5449, 77.1926, 1100),
  ('osmania', 'Osmania University',                    'Hyderabad',     'Telangana',       17.4066, 78.5384, 1000),
  ('vit',     'Vellore Institute of Technology',       'Vellore',       'Tamil Nadu',      12.9692, 79.1559, 1100),
  ('iitm',    'IIT Madras',                            'Chennai',       'Tamil Nadu',      12.9917, 80.2333, 1200),
  ('iisc',    'Indian Institute of Science',           'Bengaluru',     'Karnataka',       13.0219, 77.5671, 1000),
  ('bits_pilani', 'BITS Pilani',                       'Pilani',        'Rajasthan',       28.3643, 75.5906, 900),
  ('bhu',     'Banaras Hindu University',              'Varanasi',      'Uttar Pradesh',   25.2677, 82.9990, 1500),
  ('amu',     'Aligarh Muslim University',             'Aligarh',       'Uttar Pradesh',   27.9148, 78.0785, 1000),
  ('manipal', 'Manipal Academy of Higher Education',  'Manipal',       'Karnataka',       13.3539, 74.7932, 1200),
  ('lpu',     'Lovely Professional University',        'Phagwara',      'Punjab',          31.2553, 75.7049, 1200),
  ('mahindra','Mahindra University',                   'Hyderabad',     'Telangana',       17.5939, 78.4833, 600),
  ('amity',   'Amity University Noida',                'Noida',         'Uttar Pradesh',   28.9107, 77.1100, 900),
  ('srm',     'SRM Institute of Science and Technology','Chennai',      'Tamil Nadu',      12.8231, 80.0444, 900),
  ('christ',  'Christ University',                     'Bengaluru',     'Karnataka',       12.9249, 77.6017, 500),
  ('symbiosis','Symbiosis International University',  'Pune',          'Maharashtra',     18.5292, 73.7847, 800)
on conflict (id) do nothing;

-- ============================================================
-- DEMO USER SETUP (run AFTER creating users in Supabase Auth)
-- ============================================================
-- Create users in Supabase Dashboard > Authentication > Users:
--   student@smartcampus.in  / student123
--   tech@smartcampus.in     / tech123
--   admin@smartcampus.in    / admin123
--
-- Then replace the UUIDs below with actual user IDs from Auth table:

-- insert into public.profiles (id, full_name, email, university_id, role) values
--   ('USER-UUID-1', 'Riya Sharma',     'student@smartcampus.in', 'um', 'student'),
--   ('USER-UUID-2', 'Rajesh Mehta',    'tech@smartcampus.in',    'um', 'technician'),
--   ('USER-UUID-3', 'Admin User',      'admin@smartcampus.in',   'um', 'admin');

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.issues enable row level security;
alter table public.announcements enable row level security;
alter table public.universities enable row level security;

-- Universities: anyone can read
create policy "universities_read" on public.universities for select using (true);

-- Profiles: users can read own profile; admins can read all in their university
create policy "profiles_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Issues: students see own; technicians see assigned; admins see all in university
create policy "issues_student_read" on public.issues for select
  using (reported_by = auth.uid());

create policy "issues_technician_read" on public.issues for select
  using (assigned_to = auth.uid());

create policy "issues_student_insert" on public.issues for insert
  with check (reported_by = auth.uid());

create policy "issues_technician_update" on public.issues for update
  using (assigned_to = auth.uid());

-- Admin full access (via service role or custom claim - recommended to use service role key for admin routes)
create policy "issues_admin_all" on public.issues for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin' and p.university_id = issues.university_id
    )
  );

-- Announcements: all can read
create policy "announcements_read" on public.announcements for select using (true);
create policy "announcements_admin_insert" on public.announcements for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- SUPABASE STORAGE BUCKET
-- ============================================================
-- Create a bucket named: issue-images
-- Set it as PUBLIC for image display
-- Go to: Storage > New Bucket > Name: issue-images > Public: ON

-- ============================================================
-- SAMPLE ANNOUNCEMENTS
-- ============================================================
insert into public.announcements (university_id, title, body) values
  ('um', 'Maintenance work in Block B', 'Scheduled maintenance for electrical systems in Block B on Saturday, 25 May 2024.'),
  ('um', 'New Complaint Portal Launched', 'Students can now report issues directly via Smart Campus app.'),
  ('iitb', 'Campus Wi-Fi Upgrade', 'Network infrastructure upgrade scheduled next week. Expect brief outages.');

-- ============================================================
-- REALTIME SUBSCRIPTIONS (enable these tables)
-- ============================================================
-- Go to: Supabase Dashboard > Database > Replication
-- Enable replication for tables: issues, announcements

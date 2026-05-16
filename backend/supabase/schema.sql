-- SafeChain MK prototype schema.
-- Run this in the Supabase SQL editor, then run `npm run db:seed`.
-- The permissive policies below are for the hackathon prototype with a publishable key.
-- For production, keep writes behind the backend with a service role key and tighten RLS.

create extension if not exists pgcrypto;

create table if not exists public.violations (
  id uuid primary key default gen_random_uuid(),
  demo_code text,
  code_hash text not null unique,
  ref_id text not null unique,
  kind text not null check (kind in ('speeding', 'red_light', 'expired_registration', 'no_parking')),
  status text check (status in ('unpaid', 'paid', 'voided', 'appeal_pending')),
  plate text not null,
  vehicle_make text not null,
  car_color text not null,
  date_time timestamptz not null,
  street_mk text not null,
  street_en text not null,
  street_sr text not null,
  city_mk text not null,
  city_en text not null,
  city_sr text not null,
  lat numeric(10, 6) not null,
  lng numeric(10, 6) not null,
  speed_recorded integer,
  speed_limit integer,
  camera_id text not null,
  issued_at timestamptz not null,
  due_date date not null,
  early_payment_deadline date not null,
  early_payment_discount_percent integer not null default 50,
  base_fine_eur numeric(10, 2) not null,
  base_fine_mkd integer not null,
  amount_due_mkd integer not null,
  penalty_points integer,
  driving_ban_mk text,
  driving_ban_en text,
  driving_ban_sr text,
  owner_fine_eur numeric(10, 2),
  parking_severity text,
  legal_note_mk text not null,
  legal_note_en text not null,
  legal_note_sr text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.violations
  add column if not exists demo_code text,
  add column if not exists status text check (status in ('unpaid', 'paid', 'voided', 'appeal_pending'));

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  receipt_id text unique,
  code_hash text not null,
  method text not null check (method in ('crypto', 'non_crypto')),
  status text not null default 'confirmed',
  amount_mkd integer not null,
  amount_sol numeric(18, 9),
  payer text,
  signature text unique,
  memo text,
  memo_summary jsonb,
  network text,
  provider text,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists violations_code_hash_idx on public.violations (code_hash);
create index if not exists payments_code_hash_paid_at_idx on public.payments (code_hash, paid_at desc);

alter table public.violations enable row level security;
alter table public.payments enable row level security;

drop policy if exists "prototype read violations" on public.violations;
drop policy if exists "prototype read payments" on public.payments;
drop policy if exists "prototype insert payments" on public.payments;
drop policy if exists "prototype seed violations" on public.violations;
drop policy if exists "prototype update violations" on public.violations;

create policy "prototype read violations"
  on public.violations for select
  to anon, authenticated
  using (true);

create policy "prototype seed violations"
  on public.violations for insert
  to anon, authenticated
  with check (true);

create policy "prototype update violations"
  on public.violations for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "prototype read payments"
  on public.payments for select
  to anon, authenticated
  using (true);

create policy "prototype insert payments"
  on public.payments for insert
  to anon, authenticated
  with check (true);

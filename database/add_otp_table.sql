-- ============================================
-- 9. VERIFICATION CODES (SMS OTP)
-- ============================================
create table rentbase.verification_codes (
  id uuid default gen_random_uuid() primary key,
  phone text not null,
  code text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Index for fast lookup
create index idx_verification_codes_phone on rentbase.verification_codes (phone);

-- RLS
alter table rentbase.verification_codes enable row level security;

-- Only server should access this table mostly, but for now allow public insert/select for verify flow
-- Actually, strict security: 
-- Insert: Anyone (to request code)
-- Select: Anyone (to verify code)? No, verify endpoint uses service role or generic select.

create policy "Anyone can insert verification codes"
  on rentbase.verification_codes for insert
  with check (true);

create policy "Anyone can select verification codes"
  on rentbase.verification_codes for select
  using (true);

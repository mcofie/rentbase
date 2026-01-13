-- Fix RLS policies preventing contract/report finalization
-- The issue was that the UPDATE policies defaulted WITH CHECK to the USING clause,
-- which enforced is_finalized = false, preventing the update to is_finalized = true.

-- ==========================================
-- 1. CONTRACTS (Pocket Lawyer)
-- ==========================================

drop policy if exists "Anyone can update draft contracts" on rentbase.contracts;

create policy "Anyone can update draft contracts"
  on rentbase.contracts for update
  using (user_id is null and is_finalized = false)
  with check (user_id is null); 
  -- We allow changing is_finalized to true, as long as it stays anonymous (user_id is null)

-- ==========================================
-- 2. CONDITION REPORTS (Deposit Shield)
-- ==========================================

drop policy if exists "Anyone can update draft reports" on rentbase.condition_reports;

create policy "Anyone can update draft reports"
  on rentbase.condition_reports for update
  using (user_id is null and is_finalized = false)
  with check (user_id is null);
  -- We allow changing is_finalized to true, as long as it stays anonymous

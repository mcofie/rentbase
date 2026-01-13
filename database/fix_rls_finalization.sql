-- =========================================================
-- Fix RLS Policies for Payment Finalization
-- Run this in Supabase SQL Editor
-- =========================================================

-- ==========================================
-- 1. CONTRACTS - FIX UPDATE POLICIES
-- ==========================================

-- Drop all existing update policies for contracts
DROP POLICY IF EXISTS "Users can update own contracts" ON rentbase.contracts;
DROP POLICY IF EXISTS "Anyone can update draft contracts" ON rentbase.contracts;

-- Create a single, permissive update policy
-- Allows: 
-- 1. Authenticated users to update their own contracts
-- 2. Anyone to update contracts where user_id is null (anonymous drafts)
-- 3. Anyone to update contracts by ID (for finalization after payment)
CREATE POLICY "Allow contract updates"
  ON rentbase.contracts FOR UPDATE
  USING (
    auth.uid() = user_id  -- User owns it
    OR user_id IS NULL    -- Anonymous draft
    OR is_finalized = false  -- Any draft can be updated
  )
  WITH CHECK (true);  -- Allow any new values


-- ==========================================
-- 2. CONDITION REPORTS - FIX UPDATE POLICIES  
-- ==========================================

DROP POLICY IF EXISTS "Users can update own reports" ON rentbase.condition_reports;
DROP POLICY IF EXISTS "Anyone can update draft reports" ON rentbase.condition_reports;

CREATE POLICY "Allow report updates"
  ON rentbase.condition_reports FOR UPDATE
  USING (
    auth.uid() = user_id  -- User owns it
    OR user_id IS NULL    -- Anonymous draft
    OR is_finalized = false  -- Any draft can be updated
  )
  WITH CHECK (true);


-- ==========================================
-- 3. TRANSACTIONS - FIX ALL POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Users can create transactions" ON rentbase.transactions;
DROP POLICY IF EXISTS "Users can view own transactions" ON rentbase.transactions;
DROP POLICY IF EXISTS "Anyone can create transactions" ON rentbase.transactions;
DROP POLICY IF EXISTS "Anyone can view transactions" ON rentbase.transactions;
DROP POLICY IF EXISTS "Anyone can update transactions" ON rentbase.transactions;

CREATE POLICY "Anyone can create transactions"
  ON rentbase.transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view transactions"
  ON rentbase.transactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update transactions"
  ON rentbase.transactions FOR UPDATE
  USING (true);

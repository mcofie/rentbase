-- =========================================================
-- NUCLEAR OPTION: Complete RLS Fix for Contracts
-- This script drops ALL policies and recreates them properly
-- Run this in Supabase SQL Editor
-- =========================================================

-- ==========================================
-- STEP 1: DROP ALL CONTRACT POLICIES
-- ==========================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on rentbase.contracts
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'rentbase' AND tablename = 'contracts'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON rentbase.contracts', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- ==========================================
-- STEP 2: CREATE NEW PERMISSIVE POLICIES
-- ==========================================

-- SELECT: Allow all reads
CREATE POLICY "contracts_select"
  ON rentbase.contracts FOR SELECT
  USING (true);

-- INSERT: Allow all inserts
CREATE POLICY "contracts_insert"
  ON rentbase.contracts FOR INSERT
  WITH CHECK (true);

-- UPDATE: Allow all updates  
CREATE POLICY "contracts_update"
  ON rentbase.contracts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- DELETE: Only authenticated users can delete their own
CREATE POLICY "contracts_delete"
  ON rentbase.contracts FOR DELETE
  USING (auth.uid() = user_id);


-- ==========================================
-- STEP 3: DROP ALL CONDITION_REPORTS POLICIES
-- ==========================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'rentbase' AND tablename = 'condition_reports'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON rentbase.condition_reports', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- ==========================================
-- STEP 4: CREATE NEW PERMISSIVE POLICIES FOR REPORTS
-- ==========================================

CREATE POLICY "reports_select"
  ON rentbase.condition_reports FOR SELECT
  USING (true);

CREATE POLICY "reports_insert"
  ON rentbase.condition_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "reports_update"
  ON rentbase.condition_reports FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "reports_delete"
  ON rentbase.condition_reports FOR DELETE
  USING (auth.uid() = user_id);


-- ==========================================
-- STEP 5: FIX TRANSACTIONS TABLE
-- ==========================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'rentbase' AND tablename = 'transactions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON rentbase.transactions', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

CREATE POLICY "transactions_select"
  ON rentbase.transactions FOR SELECT
  USING (true);

CREATE POLICY "transactions_insert"
  ON rentbase.transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "transactions_update"
  ON rentbase.transactions FOR UPDATE
  USING (true)
  WITH CHECK (true);


-- ==========================================
-- VERIFY: List all policies
-- ==========================================
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'rentbase' 
  AND tablename IN ('contracts', 'condition_reports', 'transactions')
ORDER BY tablename, policyname;

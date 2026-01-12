-- ==========================================
-- REPAIR SCRIPT: Fix Review Submission
-- ==========================================

-- 1. Safely add missing columns (Idempotent Check)
DO $$
BEGIN
    -- Add reviewer_phone if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'rentbase' AND table_name = 'reviews' AND column_name = 'reviewer_phone') THEN
        ALTER TABLE rentbase.reviews ADD COLUMN reviewer_phone text;
    END IF;

    -- Add ip_address if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'rentbase' AND table_name = 'reviews' AND column_name = 'ip_address') THEN
        ALTER TABLE rentbase.reviews ADD COLUMN ip_address text;
    END IF;

    -- Add session_id if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'rentbase' AND table_name = 'reviews' AND column_name = 'session_id') THEN
        ALTER TABLE rentbase.reviews ADD COLUMN session_id text;
    END IF;
END $$;

-- 2. Reset RLS Policies (Drop old/duplicate policies first)
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON rentbase.reviews;
DROP POLICY IF EXISTS "Anyone can create reviews" ON rentbase.reviews;

-- Create the open policy
CREATE POLICY "Anyone can create reviews"
ON rentbase.reviews FOR INSERT
WITH CHECK (true);

-- 3. Ensure Permisions (Grant access to anonymous users)
GRANT USAGE ON SCHEMA rentbase TO anon, authenticated;
GRANT ALL ON TABLE rentbase.reviews TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA rentbase TO anon, authenticated;

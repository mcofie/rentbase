-- ============================================
-- Agent Claims Table for Registration Requests
-- ============================================

-- Create agent_claims table for pending registrations
CREATE TABLE IF NOT EXISTS rentbase.agent_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  full_name TEXT NOT NULL,
  agency_name TEXT,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES rentbase.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on phone to prevent duplicate claims
CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_claims_phone ON rentbase.agent_claims(phone);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_agent_claims_status ON rentbase.agent_claims(status);

-- Create index for date ordering
CREATE INDEX IF NOT EXISTS idx_agent_claims_created_at ON rentbase.agent_claims(created_at DESC);

-- Enable RLS
ALTER TABLE rentbase.agent_claims ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit a claim (insert)
DROP POLICY IF EXISTS "Anyone can submit agent claims" ON rentbase.agent_claims;
CREATE POLICY "Anyone can submit agent claims" ON rentbase.agent_claims
  FOR INSERT
  WITH CHECK (true);

-- Policy: Admins can view all claims
DROP POLICY IF EXISTS "Admins can view all claims" ON rentbase.agent_claims;
CREATE POLICY "Admins can view all claims" ON rentbase.agent_claims
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rentbase.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update claims (approve/reject)
DROP POLICY IF EXISTS "Admins can update claims" ON rentbase.agent_claims;
CREATE POLICY "Admins can update claims" ON rentbase.agent_claims
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rentbase.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Allow service role full access (for API operations)
DROP POLICY IF EXISTS "Service role has full access to claims" ON rentbase.agent_claims;
CREATE POLICY "Service role has full access to claims" ON rentbase.agent_claims
  FOR ALL
  USING (auth.role() = 'service_role');

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION rentbase.update_agent_claims_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_agent_claims_updated_at ON rentbase.agent_claims;
CREATE TRIGGER trigger_update_agent_claims_updated_at
  BEFORE UPDATE ON rentbase.agent_claims
  FOR EACH ROW
  EXECUTE FUNCTION rentbase.update_agent_claims_updated_at();

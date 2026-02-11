
-- User Sessions Table for General Users (Agents, etc.)
-- Used when Supabase Auth Phone provider is unavailable

CREATE TABLE IF NOT EXISTS rentbase.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Logical ID (from profiles or agent_claims)
    role TEXT NOT NULL,     -- 'agent', 'tenant', etc.
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for session lookup
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON rentbase.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON rentbase.user_sessions(expires_at);

-- Enable RLS
ALTER TABLE rentbase.user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Service role only
CREATE POLICY "Service role access only" ON rentbase.user_sessions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

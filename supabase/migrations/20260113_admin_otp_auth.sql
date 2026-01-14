-- Admin OTP Authentication (Custom Implementation)
-- This is a custom OTP system not using Supabase Auth SDK

-- Create admin_users table to store admin phone numbers
CREATE TABLE IF NOT EXISTS rentbase.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin_otps table for storing OTP codes
CREATE TABLE IF NOT EXISTS rentbase.admin_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT false,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin_sessions table for managing login sessions
CREATE TABLE IF NOT EXISTS rentbase.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES rentbase.admin_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_otps_phone ON rentbase.admin_otps(phone);
CREATE INDEX IF NOT EXISTS idx_admin_otps_expires ON rentbase.admin_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON rentbase.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON rentbase.admin_sessions(expires_at);

-- Function to clean up expired OTPs (run periodically)
CREATE OR REPLACE FUNCTION rentbase.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM rentbase.admin_otps WHERE expires_at < now();
    DELETE FROM rentbase.admin_sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin user (update phone number as needed)
INSERT INTO rentbase.admin_users (phone, name)
VALUES ('+233XXXXXXXXX', 'Admin')
ON CONFLICT (phone) DO NOTHING;

-- Enable RLS
ALTER TABLE rentbase.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentbase.admin_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentbase.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for admin tables (service role only - no public access)
CREATE POLICY "Service role access only" ON rentbase.admin_users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role access only" ON rentbase.admin_otps
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role access only" ON rentbase.admin_sessions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

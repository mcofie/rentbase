-- ============================================
-- RentBase Agent Features Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- Make sure the schema exists
CREATE SCHEMA IF NOT EXISTS rentbase;

-- ============================================
-- Agent Reports Table (for Report Agent feature)
-- ============================================

CREATE TABLE IF NOT EXISTS rentbase.agent_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_phone TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    reporter_phone TEXT,
    ip_address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
    admin_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_agent_reports_agent_phone ON rentbase.agent_reports(agent_phone);
CREATE INDEX IF NOT EXISTS idx_agent_reports_status ON rentbase.agent_reports(status);
CREATE INDEX IF NOT EXISTS idx_agent_reports_created_at ON rentbase.agent_reports(created_at DESC);

-- Row Level Security policies
ALTER TABLE rentbase.agent_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reports (with rate limiting at API level)
DROP POLICY IF EXISTS "Anyone can submit reports" ON rentbase.agent_reports;
CREATE POLICY "Anyone can submit reports" ON rentbase.agent_reports
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Only admins can view/update reports
DROP POLICY IF EXISTS "Admins can view all reports" ON rentbase.agent_reports;
CREATE POLICY "Admins can view all reports" ON rentbase.agent_reports
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update reports" ON rentbase.agent_reports;
CREATE POLICY "Admins can update reports" ON rentbase.agent_reports
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- ============================================
-- Agent Location Options (for filter)
-- ============================================

CREATE TABLE IF NOT EXISTS rentbase.locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT,
    country TEXT DEFAULT 'GH',
    sort_order INTEGER DEFAULT 0
);

-- Insert Ghana locations (skip if already exist)
INSERT INTO rentbase.locations (id, name, region, sort_order) VALUES
    ('accra-central', 'Accra Central', 'Greater Accra', 1),
    ('east-legon', 'East Legon', 'Greater Accra', 2),
    ('airport-residential', 'Airport Residential', 'Greater Accra', 3),
    ('cantonments', 'Cantonments', 'Greater Accra', 4),
    ('osu', 'Osu', 'Greater Accra', 5),
    ('la', 'La', 'Greater Accra', 6),
    ('labone', 'Labone', 'Greater Accra', 7),
    ('tema', 'Tema', 'Greater Accra', 8),
    ('spintex', 'Spintex', 'Greater Accra', 9),
    ('achimota', 'Achimota', 'Greater Accra', 10),
    ('madina', 'Madina', 'Greater Accra', 11),
    ('adenta', 'Adenta', 'Greater Accra', 12),
    ('kasoa', 'Kasoa', 'Central', 13),
    ('kumasi', 'Kumasi', 'Ashanti', 14),
    ('takoradi', 'Takoradi', 'Western', 15),
    ('cape-coast', 'Cape Coast', 'Central', 16),
    ('tamale', 'Tamale', 'Northern', 17),
    ('other', 'Other', NULL, 99)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Add Review Response columns (if reviews table exists)
-- ============================================

DO $$
BEGIN
    -- Add agent_response column if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'rentbase' AND table_name = 'reviews') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'rentbase' AND table_name = 'reviews' AND column_name = 'agent_response') THEN
            ALTER TABLE rentbase.reviews ADD COLUMN agent_response TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'rentbase' AND table_name = 'reviews' AND column_name = 'agent_response_at') THEN
            ALTER TABLE rentbase.reviews ADD COLUMN agent_response_at TIMESTAMPTZ;
        END IF;
    END IF;
END $$;

-- ============================================
-- Notifications Table (for email/push)
-- ============================================

CREATE TABLE IF NOT EXISTS rentbase.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    phone TEXT,
    email TEXT,
    type TEXT NOT NULL CHECK (type IN ('contract_ready', 'signing_request', 'contract_signed', 'new_review', 'report_update', 'system')),
    title TEXT NOT NULL,
    body TEXT,
    data JSONB DEFAULT '{}',
    read_at TIMESTAMPTZ,
    sent_via TEXT[] DEFAULT '{}', -- ['email', 'sms', 'push']
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON rentbase.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_phone ON rentbase.notifications(phone);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON rentbase.notifications(created_at DESC);

-- RLS for notifications
ALTER TABLE rentbase.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON rentbase.notifications;
CREATE POLICY "Users can view own notifications" ON rentbase.notifications
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON rentbase.notifications;
CREATE POLICY "Users can update own notifications" ON rentbase.notifications
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

-- Allow system to insert notifications
DROP POLICY IF EXISTS "System can insert notifications" ON rentbase.notifications;
CREATE POLICY "System can insert notifications" ON rentbase.notifications
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

-- ============================================
-- Agent Invite Logs (already exists, but ensure index)
-- ============================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'rentbase' AND table_name = 'agent_invites') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_invites_agent_phone ON rentbase.agent_invites(agent_phone);
    END IF;
END $$;

-- ============================================
-- Success message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
END $$;

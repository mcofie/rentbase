-- ============================================
-- System Settings Table
-- ============================================

CREATE TABLE IF NOT EXISTS rentbase.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES rentbase.profiles(id)
);

-- Enable RLS
ALTER TABLE rentbase.system_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings
DROP POLICY IF EXISTS "Anyone can view settings" ON rentbase.system_settings;
CREATE POLICY "Anyone can view settings" ON rentbase.system_settings
  FOR SELECT
  USING (true);

-- Policy: Admins can update settings
DROP POLICY IF EXISTS "Admins can manage settings" ON rentbase.system_settings;
CREATE POLICY "Admins can manage settings" ON rentbase.system_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM rentbase.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default prices
INSERT INTO rentbase.system_settings (key, value, description)
VALUES 
  ('price_contract', '{"amount": 40, "currency": "GHS"}', 'Price for generating a tenancy agreement'),
  ('price_condition_report', '{"amount": 25, "currency": "GHS"}', 'Price for generating a condition report')
ON CONFLICT (key) DO NOTHING;

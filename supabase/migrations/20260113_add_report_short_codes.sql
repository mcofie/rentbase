-- Add short codes for deposit reports
-- These are 8-character alphanumeric codes for SMS-friendly report IDs
-- Also add phone number field for SMS notifications

-- Add columns
ALTER TABLE rentbase.condition_reports 
ADD COLUMN IF NOT EXISTS short_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Create index for fast lookup
CREATE INDEX IF NOT EXISTS idx_condition_reports_short_code ON rentbase.condition_reports (short_code);

-- Reuse the generate_short_code function from contracts migration
-- (It should already exist, but we create if not)
CREATE OR REPLACE FUNCTION rentbase.generate_short_code(length INT DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    result TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Generate short codes for existing reports that don't have them
UPDATE rentbase.condition_reports 
SET short_code = rentbase.generate_short_code(8)
WHERE short_code IS NULL;

-- Set default for new rows
ALTER TABLE rentbase.condition_reports 
ALTER COLUMN short_code SET DEFAULT rentbase.generate_short_code(8);

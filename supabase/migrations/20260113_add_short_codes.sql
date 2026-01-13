-- Add short codes for signing links
-- These are 8-character alphanumeric codes for SMS-friendly URLs

-- Add columns for short codes
ALTER TABLE rentbase.contracts 
ADD COLUMN IF NOT EXISTS landlord_short_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tenant_short_code TEXT UNIQUE;

-- Create indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_contracts_landlord_short_code ON rentbase.contracts (landlord_short_code);
CREATE INDEX IF NOT EXISTS idx_contracts_tenant_short_code ON rentbase.contracts (tenant_short_code);

-- Function to generate random short code
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

-- Generate short codes for existing contracts that don't have them
UPDATE rentbase.contracts 
SET landlord_short_code = rentbase.generate_short_code(8)
WHERE landlord_short_code IS NULL;

UPDATE rentbase.contracts 
SET tenant_short_code = rentbase.generate_short_code(8)
WHERE tenant_short_code IS NULL;

-- Make columns NOT NULL after populating
-- ALTER TABLE rentbase.contracts ALTER COLUMN landlord_short_code SET NOT NULL;
-- ALTER TABLE rentbase.contracts ALTER COLUMN tenant_short_code SET NOT NULL;

-- Set defaults for new rows
ALTER TABLE rentbase.contracts 
ALTER COLUMN landlord_short_code SET DEFAULT rentbase.generate_short_code(8);

ALTER TABLE rentbase.contracts 
ALTER COLUMN tenant_short_code SET DEFAULT rentbase.generate_short_code(8);

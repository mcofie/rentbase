
-- Migration to add email/password support to admin_users
-- Run this in your Supabase SQL Editor

ALTER TABLE rentbase.admin_users 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Index for email
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON rentbase.admin_users(email);

-- Optional: Seed the specific admin user if not exists
-- Replace 'HASH_HERE' with a generated hash using the helper in server/utils/adminAuth.ts
-- INSERT INTO rentbase.admin_users (email, name, password_hash)
-- VALUES ('maxcofie@gmail.com', 'Max Cofie', 'SALT:HASH')
-- ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Link an existing user (by phone number) to the admin role
-- NOTE: The user must have already signed up/logged in once to exist in the profiles table.

UPDATE rentbase.profiles
SET role = 'admin'
WHERE phone_number = '+233558508306'; -- Replace with actual phone number

-- Add user_email column to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Update existing bookings to populate user_email from auth.users
-- This is a one-time migration for existing data
UPDATE public.bookings
SET user_email = (SELECT email FROM auth.users WHERE auth.users.id = bookings.user_id)
WHERE user_email IS NULL;

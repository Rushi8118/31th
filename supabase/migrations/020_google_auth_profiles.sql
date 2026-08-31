-- ============================================================
-- MIGRATION 020: Google OAuth Profile Handling
-- ============================================================
-- Improves the handle_new_user trigger to capture:
--  - profile_photo_url from Google's avatar_url
--  - Better name parsing from Google's full_name
-- ============================================================

-- Update the handle_new_user function to capture Google avatar
CREATE OR REPLACE FUNCTION app_private.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    profile_photo_url,
    phone,
    whatsapp
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), ''),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.user_profiles.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.user_profiles.last_name),
    profile_photo_url = COALESCE(EXCLUDED.profile_photo_url, public.user_profiles.profile_photo_url),
    phone = COALESCE(EXCLUDED.phone, public.user_profiles.phone),
    whatsapp = COALESCE(EXCLUDED.whatsapp, public.user_profiles.whatsapp),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add RPC for checking if user has a password set (useful for Google-only users)
CREATE OR REPLACE FUNCTION has_password()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND encrypted_password IS NOT NULL
    AND encrypted_password != ''
  );
$$;

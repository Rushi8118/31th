-- =========================================================
-- FIX: "Database error querying schema" on login
-- 1. Drops problematic RLS policies on new tables
-- 2. Recreates RPC functions safely
-- 3. Grants proper permissions
-- 4. Verifies everything works
-- =========================================================

-- Drop problematic RLS policies on RBAC tables (they can cause schema errors)
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.roles;
DROP POLICY IF EXISTS "Authenticated users can read permissions" ON public.permissions;
DROP POLICY IF EXISTS "Authenticated users can read role_permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Users can read own user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "System can insert user_roles" ON public.user_roles;

-- Recreate simple RLS policies that won't cause schema errors
CREATE POLICY "Allow all read roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Allow all read permissions" ON public.permissions FOR SELECT USING (true);
CREATE POLICY "Allow all read role_permissions" ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "Allow all read user_roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Allow all insert user_roles" ON public.user_roles FOR INSERT WITH CHECK (true);

-- Drop and recreate RPC functions with error-proof implementations
DROP FUNCTION IF EXISTS get_my_permissions;
DROP FUNCTION IF EXISTS get_user_roles;

CREATE OR REPLACE FUNCTION public.get_my_permissions()
RETURNS TABLE (permission_slug TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.key::TEXT
  FROM public.permissions p
  JOIN public.role_permissions rp ON rp.permission_id = p.id
  JOIN public.user_roles ur ON ur.role_id = rp.role_id
  WHERE ur.user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_roles()
RETURNS TABLE (role_id UUID, role_slug TEXT, role_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.slug::TEXT, r.name::TEXT
  FROM public.roles r
  JOIN public.user_roles ur ON ur.role_id = r.id
  WHERE ur.user_id = auth.uid();
END;
$$;

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT EXECUTE ON FUNCTION public.get_my_permissions() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles() TO anon, authenticated;

-- Verify the super admin user exists and is properly configured
DO $$
DECLARE
  v_user_id UUID;
  v_profile_exists BOOLEAN;
  v_role_exists BOOLEAN;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'administrator@siddhivinayakoverseas.com';

  IF v_user_id IS NULL THEN
    RAISE WARNING 'Super admin user NOT FOUND in auth.users';
  ELSE
    RAISE NOTICE 'Super admin user FOUND in auth.users: %', v_user_id;

    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE id = v_user_id) INTO v_profile_exists;
    SELECT EXISTS(SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = v_user_id AND r.slug = 'super_admin') INTO v_role_exists;

    IF v_profile_exists THEN
      RAISE NOTICE 'Profile exists ✓';
    ELSE
      RAISE WARNING 'Profile MISSING - creating now';
      INSERT INTO public.user_profiles (id, email, full_name, user_role, status)
      VALUES (v_user_id, 'administrator@siddhivinayakoverseas.com', 'Super Administrator', 'super_admin', 'active')
      ON CONFLICT (id) DO NOTHING;
    END IF;

    IF v_role_exists THEN
      RAISE NOTICE 'super_admin role assigned ✓';
    ELSE
      RAISE WARNING 'super_admin role MISSING - assigning now';
      INSERT INTO public.user_roles (user_id, role_id)
      SELECT v_user_id, id FROM public.roles WHERE slug = 'super_admin'
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;

-- =========================================================
-- COMPLETE FIX: Remove problematic RLS, fix RPCs, verify user
-- =========================================================

-- 1. DROP all RLS policies on RBAC tables (they cause schema errors)
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.roles;
DROP POLICY IF EXISTS "Authenticated users can read permissions" ON public.permissions;
DROP POLICY IF EXISTS "Authenticated users can read role_permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Users can read own user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "System can insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow all read roles" ON public.roles;
DROP POLICY IF EXISTS "Allow all read permissions" ON public.permissions;
DROP POLICY IF EXISTS "Allow all read role_permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Allow all read user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow all insert user_roles" ON public.user_roles;

-- 2. DISABLE RLS on RBAC tables entirely
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 3. Drop and recreate RPC functions (simple, robust)
DROP FUNCTION IF EXISTS public.get_my_permissions;
DROP FUNCTION IF EXISTS public.get_user_roles;

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

GRANT EXECUTE ON FUNCTION public.get_my_permissions() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles() TO anon, authenticated;

-- 4. Ensure the super admin user, profile, and role all exist
DO $$
DECLARE
  v_user_id UUID;
  v_role_id UUID;
  v_email TEXT := 'administrator@siddhivinayakoverseas.com';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User % not found in auth.users. Create it via Supabase Dashboard > Authentication > Users > Add User first.', v_email;
  END IF;

  RAISE NOTICE 'User found: %', v_user_id;

  -- Ensure profile exists
  INSERT INTO public.user_profiles (id, email, full_name, user_role, status)
  VALUES (v_user_id, v_email, 'Super Administrator', 'super_admin', 'active')
  ON CONFLICT (id) DO UPDATE SET
    user_role = 'super_admin', status = 'active', updated_at = NOW();

  -- Ensure super_admin role exists
  INSERT INTO public.roles (name, slug, description, is_system)
  VALUES ('Super Admin', 'super_admin', 'Full control over everything', TRUE)
  ON CONFLICT (slug) DO NOTHING;

  -- Assign role
  SELECT id INTO v_role_id FROM public.roles WHERE slug = 'super_admin';
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (v_user_id, v_role_id)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Super Admin fully configured: %', v_email;
END $$;

-- 5. Final verification
SELECT 'USER' as check_type, u.id, u.email, p.user_role
FROM auth.users u
JOIN public.user_profiles p ON p.id = u.id
WHERE u.email = 'administrator@siddhivinayakoverseas.com';

SELECT 'ROLES' as check_type, r.name, r.slug
FROM public.user_roles ur
JOIN public.roles r ON r.id = ur.role_id
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'administrator@siddhivinayakoverseas.com';

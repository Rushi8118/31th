-- =========================================================
-- Step 1: Update the user_role CHECK constraint
-- =========================================================
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_user_role_check;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_user_role_check
  CHECK (user_role IN (
    'user', 'consultant', 'admin',
    'customer', 'hr', 'visa_officer', 'counselor',
    'accountant', 'marketing', 'super_admin',
    'viewer', 'editor', 'manager', 'superadmin'
  ));

-- =========================================================
-- Step 2: Create the RBAC tables (if not exist)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  module VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable Row Level Security on new tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop policies first if they exist, then create them
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.roles;
DROP POLICY IF EXISTS "Authenticated users can read permissions" ON public.permissions;
DROP POLICY IF EXISTS "Authenticated users can read role_permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Users can read own user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "System can insert user_roles" ON public.user_roles;

CREATE POLICY "Authenticated users can read roles" ON public.roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read permissions" ON public.permissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read role_permissions" ON public.role_permissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can read own user_roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "System can insert user_roles" ON public.user_roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =========================================================
-- Step 3: Seed the super_admin role
-- =========================================================
INSERT INTO public.roles (name, slug, description, is_system)
VALUES ('Super Admin', 'super_admin', 'Full control over everything', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- Step 4: Create the Super Admin user (no email verification)
-- Password: Admin@12345
-- =========================================================
DO $$
DECLARE
  v_user_id UUID;
  v_role_id UUID;
  v_email TEXT := 'administrator@siddhivinayakoverseas.com';
  v_password TEXT := 'Admin@12345';
  v_full_name TEXT := 'Super Administrator';
BEGIN

  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      confirmation_sent_at, raw_app_meta_data,
      raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token,
      email_change_token_current, email_change_token_new,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', v_full_name),
      NOW(), NOW(), '', '', '', '', FALSE
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider,
      provider_id, created_at, updated_at
    ) VALUES (
      v_user_id, v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email', v_email, NOW(), NOW()
    );

  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
        updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  INSERT INTO public.user_profiles (id, email, full_name, user_role, status)
  VALUES (v_user_id, v_email, v_full_name, 'super_admin', 'active')
  ON CONFLICT (id) DO UPDATE SET
    user_role = 'super_admin',
    email = v_email,
    full_name = v_full_name,
    status = 'active',
    updated_at = NOW();

  SELECT id INTO v_role_id FROM public.roles WHERE slug = 'super_admin';
  IF v_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (v_user_id, v_role_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RAISE NOTICE 'Super Admin ready: % (ID: %)', v_email, v_user_id;
END $$;

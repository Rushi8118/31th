-- =========================================================
-- Create Default Super Admin (no email verification needed)
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

  -- Check if user already exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    -- Create user in auth.users with email already confirmed
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change_token_current,
      email_change_token_new,
      recovery_token,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('full_name', v_full_name),
      NOW(),
      NOW(),
      '',
      '',
      '',
      '',
      FALSE
    )
    RETURNING id INTO v_user_id;

    -- Create identity record (required for auth)
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      v_email,
      NOW(),
      NOW()
    );

  ELSE
    -- Update existing user password and confirm email
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
        updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  -- Create/update profile
  INSERT INTO public.user_profiles (id, email, full_name, user_role, status)
  VALUES (v_user_id, v_email, v_full_name, 'super_admin', 'active')
  ON CONFLICT (id) DO UPDATE SET
    user_role = 'super_admin',
    email = v_email,
    full_name = v_full_name,
    status = 'active',
    updated_at = NOW();

  -- Assign super_admin role in RBAC
  SELECT id INTO v_role_id FROM public.roles WHERE slug = 'super_admin';
  
  IF v_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (v_user_id, v_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;

  RAISE NOTICE 'Super Admin created/updated: % (ID: %)', v_email, v_user_id;
END $$;

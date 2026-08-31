-- =========================================================
-- AI Blog Writer: shared admin AI settings + RBAC fix
-- Run this in Supabase SQL Editor (once).
-- =========================================================

-- 1) Shared AI provider settings (all admins read/write)
CREATE TABLE IF NOT EXISTS public.admin_ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton_key TEXT NOT NULL UNIQUE DEFAULT 'default',
  active_provider TEXT NOT NULL DEFAULT 'gemini'
    CHECK (active_provider IN ('gemini', 'openrouter')),
  gemini_api_key TEXT,
  gemini_model TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
  openrouter_api_key TEXT,
  openrouter_model TEXT NOT NULL DEFAULT 'google/gemini-2.0-flash-001',
  website_context TEXT DEFAULT 'Siddhivinayak Overseas — study visa and work visa consultants in Surat, Gujarat (Canada, UK, Australia, USA, Germany, Japan and more).',
  default_category TEXT NOT NULL DEFAULT 'general',
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.admin_ai_settings (singleton_key)
VALUES ('default')
ON CONFLICT (singleton_key) DO NOTHING;

ALTER TABLE public.admin_ai_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read AI settings" ON public.admin_ai_settings;
DROP POLICY IF EXISTS "Admins write AI settings" ON public.admin_ai_settings;

-- 2) Make permission checks honor profile role (unblocks blog CRUD for admins)
CREATE OR REPLACE FUNCTION public.user_has_permission(required_permissions TEXT[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  profile_role TEXT;
BEGIN
  SELECT user_role INTO profile_role
  FROM public.user_profiles
  WHERE id = auth.uid();

  IF profile_role IN ('super_admin', 'superadmin', 'admin') THEN
    RETURN TRUE;
  END IF;

  IF profile_role = 'marketing' AND required_permissions && ARRAY[
    'blogs.read','blogs.create','blogs.update','blogs.delete','blogs.publish',
    'seo.read','seo.update','campaigns.read','campaigns.create','campaigns.update','campaigns.delete',
    'landing_pages.read','landing_pages.create','landing_pages.update','landing_pages.delete',
    'settings.read'
  ] THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.get_my_permissions()
    WHERE permission_slug = ANY(required_permissions)
  );
EXCEPTION WHEN OTHERS THEN
  RETURN profile_role IN ('super_admin', 'superadmin', 'admin');
END;
$$;

CREATE POLICY "Admins read AI settings" ON public.admin_ai_settings
  FOR SELECT TO authenticated
  USING (public.user_has_permission(ARRAY['settings.read','settings.update','settings.manage','blogs.create']));

CREATE POLICY "Admins write AI settings" ON public.admin_ai_settings
  FOR ALL TO authenticated
  USING (public.user_has_permission(ARRAY['settings.update','settings.manage']))
  WITH CHECK (public.user_has_permission(ARRAY['settings.update','settings.manage']));

-- 3) Ensure blog DELETE works for staff
DROP POLICY IF EXISTS "Staff can delete blog posts" ON public.blog_posts;
CREATE POLICY "Staff can delete blog posts" ON public.blog_posts
  FOR DELETE TO authenticated
  USING (public.user_has_permission(ARRAY['blogs.delete']));

-- 4) Assign super_admin role row for existing admin profiles
INSERT INTO public.user_roles (user_id, role_id)
SELECT p.id, r.id
FROM public.user_profiles p
JOIN public.roles r ON r.slug = p.user_role
WHERE p.user_role IN ('super_admin', 'admin', 'superadmin')
ON CONFLICT DO NOTHING;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_ai_settings TO authenticated;

-- 5) Optional admin_sessions table (stops dashboard 404 spam)
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fingerprint TEXT,
  user_agent TEXT,
  ip_address INET,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  location TEXT,
  timezone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  terminated_at TIMESTAMPTZ,
  terminated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_sessions_user_id_idx ON public.admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS admin_sessions_active_idx ON public.admin_sessions(is_active) WHERE is_active = TRUE;

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Users can read own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "System can insert sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admins can update sessions" ON public.admin_sessions;

CREATE POLICY "Admins can read all sessions" ON public.admin_sessions
  FOR SELECT TO authenticated
  USING (public.user_has_permission(ARRAY['sessions.read','settings.read','users.read']) OR user_id = auth.uid());

CREATE POLICY "Users can read own sessions" ON public.admin_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert sessions" ON public.admin_sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.user_has_permission(ARRAY['sessions.read','settings.manage']));

CREATE POLICY "Admins can update sessions" ON public.admin_sessions
  FOR UPDATE TO authenticated
  USING (public.user_has_permission(ARRAY['sessions.read','settings.manage','users.update']) OR user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE ON public.admin_sessions TO authenticated;

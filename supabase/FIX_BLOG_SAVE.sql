-- =========================================================
-- FIX: Blog save blocked by RLS + ensure admin can publish
-- Paste into Supabase SQL Editor and RUN once.
-- =========================================================

-- 1) Permission helper: trust profile role (super_admin/admin)
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
    'seo.read','seo.update','settings.read'
  ] THEN
    RETURN TRUE;
  END IF;

  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM public.get_my_permissions()
      WHERE permission_slug = ANY(required_permissions)
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
  END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.user_has_permission(TEXT[]) TO authenticated, anon;

-- 2) Replace blog_posts policies with simple role-based rules
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published blog posts are public" ON public.blog_posts;
DROP POLICY IF EXISTS "Staff can write blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Staff can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Staff can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_select" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_insert" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_update" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_delete" ON public.blog_posts;

CREATE POLICY "blog_posts_select" ON public.blog_posts
  FOR SELECT TO anon, authenticated
  USING (
    (status = 'published' AND (published_at IS NULL OR published_at <= NOW()))
    OR (
      auth.uid() IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.user_profiles p
        WHERE p.id = auth.uid()
          AND p.user_role IN ('super_admin','superadmin','admin','marketing')
      )
    )
  );

CREATE POLICY "blog_posts_insert" ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid()
        AND p.user_role IN ('super_admin','superadmin','admin','marketing')
    )
  );

CREATE POLICY "blog_posts_update" ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid()
        AND p.user_role IN ('super_admin','superadmin','admin','marketing')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid()
        AND p.user_role IN ('super_admin','superadmin','admin','marketing')
    )
  );

CREATE POLICY "blog_posts_delete" ON public.blog_posts
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid()
        AND p.user_role IN ('super_admin','superadmin','admin')
    )
  );

-- 3) SECURITY DEFINER RPC fallback for AI blog save (bypasses stubborn policies)
CREATE OR REPLACE FUNCTION public.save_blog_post(payload JSONB)
RETURNS public.blog_posts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_role TEXT;
  result public.blog_posts;
  post_id UUID;
BEGIN
  SELECT user_role INTO profile_role
  FROM public.user_profiles
  WHERE id = auth.uid();

  IF profile_role IS NULL OR profile_role NOT IN ('super_admin','superadmin','admin','marketing') THEN
    RAISE EXCEPTION 'Not allowed to save blog posts';
  END IF;

  post_id := NULLIF(payload->>'id', '')::UUID;

  IF post_id IS NULL THEN
    INSERT INTO public.blog_posts (
      author_id, title, slug, excerpt, content, category, tags,
      meta_title, meta_desc, keywords, canonical_url, status, published_at, updated_at
    ) VALUES (
      auth.uid(),
      payload->>'title',
      payload->>'slug',
      payload->>'excerpt',
      payload->>'content',
      COALESCE(payload->>'category', 'general'),
      COALESCE(payload->'tags', '[]'::jsonb),
      payload->>'meta_title',
      payload->>'meta_desc',
      COALESCE(payload->'keywords', '[]'::jsonb),
      payload->>'canonical_url',
      COALESCE(payload->>'status', 'draft'),
      CASE WHEN payload->>'status' = 'published' THEN NOW() ELSE NULL END,
      NOW()
    )
    RETURNING * INTO result;
  ELSE
    UPDATE public.blog_posts SET
      title = payload->>'title',
      slug = payload->>'slug',
      excerpt = payload->>'excerpt',
      content = payload->>'content',
      category = COALESCE(payload->>'category', category),
      tags = COALESCE(payload->'tags', tags),
      meta_title = payload->>'meta_title',
      meta_desc = payload->>'meta_desc',
      keywords = COALESCE(payload->'keywords', keywords),
      canonical_url = payload->>'canonical_url',
      status = COALESCE(payload->>'status', status),
      published_at = CASE
        WHEN payload->>'status' = 'published' THEN COALESCE(published_at, NOW())
        WHEN payload->>'status' = 'draft' THEN NULL
        ELSE published_at
      END,
      updated_at = NOW()
    WHERE id = post_id
    RETURNING * INTO result;
  END IF;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_blog_post(JSONB) TO authenticated;

-- 4) Optional: create admin_sessions to stop dashboard 404s
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
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

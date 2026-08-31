-- Optional hardening: visitors can INSERT page views; only staff can SELECT all.
-- Run in Supabase SQL Editor if you want to lock down access logs.

ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert interactions" ON public.interactions;
DROP POLICY IF EXISTS "Admins read interactions" ON public.interactions;
DROP POLICY IF EXISTS "Public insert interactions" ON public.interactions;
DROP POLICY IF EXISTS "Staff read interactions" ON public.interactions;

CREATE POLICY "Public insert interactions" ON public.interactions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff read interactions" ON public.interactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = auth.uid()
        AND p.user_role IN ('super_admin','superadmin','admin','marketing','manager')
    )
    OR user_id = auth.uid()
  );

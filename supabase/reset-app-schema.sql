-- Optional cleanup for a fresh Supabase project after a partial failed setup run.
-- Only run this if the previous setup attempt created some app objects and rerunning
-- setup.sql now fails with "already exists" errors.

DROP VIEW IF EXISTS user_dashboard_summary;
DROP VIEW IF EXISTS featured_programs;
DROP VIEW IF EXISTS public_visa_programs;
DROP VIEW IF EXISTS public_countries;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP SCHEMA IF EXISTS app_private CASCADE;

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS saved_places CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS application_counters CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS country_faqs CASCADE;
DROP TABLE IF EXISTS visa_programs CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

DROP FUNCTION IF EXISTS increment_blog_views(UUID);
DROP FUNCTION IF EXISTS set_application_id();
DROP FUNCTION IF EXISTS generate_application_id(VARCHAR);
DROP FUNCTION IF EXISTS set_user_profile_defaults();
DROP FUNCTION IF EXISTS update_updated_at_column();

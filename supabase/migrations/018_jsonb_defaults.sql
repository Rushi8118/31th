-- Migration: Standardize JSONB defaults + backfill NULLs
-- Purpose: Ensure JSONB columns have consistent semantic defaults:
--   - objects => '{}'::jsonb
--   - arrays => '[]'::jsonb
-- Backfill existing rows where those columns are currently NULL.

BEGIN;

-- ============================================================
-- COUNTRIES (objects/arrays)
-- ============================================================
UPDATE countries
SET cost_of_living = '{}'::jsonb
WHERE cost_of_living IS NULL;

UPDATE countries
SET climate = '{}'::jsonb
WHERE climate IS NULL;

UPDATE countries
SET images = '[]'::jsonb
WHERE images IS NULL;

UPDATE countries
SET visa_stats = '{}'::jsonb
WHERE visa_stats IS NULL;

ALTER TABLE countries
  ALTER COLUMN cost_of_living SET DEFAULT '{}'::jsonb,
  ALTER COLUMN climate SET DEFAULT '{}'::jsonb,
  ALTER COLUMN images SET DEFAULT '[]'::jsonb,
  ALTER COLUMN visa_stats SET DEFAULT '{}'::jsonb;

-- ============================================================
-- VISA_PROGRAMS (arrays)
-- ============================================================
UPDATE visa_programs
SET eligibility = '[]'::jsonb
WHERE eligibility IS NULL;

UPDATE visa_programs
SET requirements = '[]'::jsonb
WHERE requirements IS NULL;

UPDATE visa_programs
SET documents_needed = '[]'::jsonb
WHERE documents_needed IS NULL;

UPDATE visa_programs
SET popular_sectors = '[]'::jsonb
WHERE popular_sectors IS NULL;

UPDATE visa_programs
SET universities = '[]'::jsonb
WHERE universities IS NULL;

UPDATE visa_programs
SET faq = '[]'::jsonb
WHERE faq IS NULL;

ALTER TABLE visa_programs
  ALTER COLUMN eligibility SET DEFAULT '[]'::jsonb,
  ALTER COLUMN requirements SET DEFAULT '[]'::jsonb,
  ALTER COLUMN documents_needed SET DEFAULT '[]'::jsonb,
  ALTER COLUMN popular_sectors SET DEFAULT '[]'::jsonb,
  ALTER COLUMN universities SET DEFAULT '[]'::jsonb,
  ALTER COLUMN faq SET DEFAULT '[]'::jsonb;

-- ============================================================
-- APPLICATIONS (objects/arrays)
-- ============================================================
UPDATE applications
SET personal_info = '{}'::jsonb
WHERE personal_info IS NULL;

UPDATE applications
SET education_history = '[]'::jsonb
WHERE education_history IS NULL;

UPDATE applications
SET work_history = '[]'::jsonb
WHERE work_history IS NULL;

UPDATE applications
SET document_checklist = '{}'::jsonb
WHERE document_checklist IS NULL;

UPDATE applications
SET meta = '{}'::jsonb
WHERE meta IS NULL;

ALTER TABLE applications
  ALTER COLUMN personal_info SET DEFAULT '{}'::jsonb,
  ALTER COLUMN education_history SET DEFAULT '[]'::jsonb,
  ALTER COLUMN work_history SET DEFAULT '[]'::jsonb,
  ALTER COLUMN document_checklist SET DEFAULT '{}'::jsonb,
  ALTER COLUMN meta SET DEFAULT '{}'::jsonb;

-- ============================================================
-- CONSULTATIONS (object)
-- ============================================================
UPDATE consultations
SET user_notes = '{}'::jsonb
WHERE user_notes IS NULL;

ALTER TABLE consultations
  ALTER COLUMN user_notes SET DEFAULT '{}'::jsonb;

-- ============================================================
-- INTERACTIONS (object)
-- ============================================================
UPDATE interactions
SET metadata = '{}'::jsonb
WHERE metadata IS NULL;

ALTER TABLE interactions
  ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;

-- ============================================================
-- BLOG_POSTS (arrays)
-- ============================================================
UPDATE blog_posts
SET tags = '[]'::jsonb
WHERE tags IS NULL;

UPDATE blog_posts
SET related_countries = '[]'::jsonb
WHERE related_countries IS NULL;

UPDATE blog_posts
SET related_programs = '[]'::jsonb
WHERE related_programs IS NULL;

UPDATE blog_posts
SET gallery = '[]'::jsonb
WHERE gallery IS NULL;

UPDATE blog_posts
SET keywords = '[]'::jsonb
WHERE keywords IS NULL;

ALTER TABLE blog_posts
  ALTER COLUMN tags SET DEFAULT '[]'::jsonb,
  ALTER COLUMN related_countries SET DEFAULT '[]'::jsonb,
  ALTER COLUMN related_programs SET DEFAULT '[]'::jsonb,
  ALTER COLUMN gallery SET DEFAULT '[]'::jsonb,
  ALTER COLUMN keywords SET DEFAULT '[]'::jsonb;

COMMIT;

-- ============================================================
-- Quick test idea (run manually in psql / SQL editor):
-- 1) Pick an existing country_id:
--    SELECT id FROM countries LIMIT 1;
-- 2) Insert a visa_program while omitting JSONB columns:
--    INSERT INTO visa_programs
--      (country_id, program_type, name, slug, description, is_active, sort_order)
--    VALUES
--      (<country_id>, 'work', 'Test Program', 'test-program', 'Test description', true, 0);
-- 3) Verify defaults applied:
--    SELECT eligibility, requirements, documents_needed FROM visa_programs WHERE slug = 'test-program';
-- ============================================================


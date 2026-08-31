-- Migration: Add auto-update trigger for country_faqs.updated_at
-- Purpose: Ensure updated_at is automatically updated on row modifications
-- Date: May 27, 2026

-- ============================================================
-- PHASE 1: ENSURE UPDATED_AT COLUMN EXISTS
-- ============================================================

-- Add updated_at column if it doesn't already exist
ALTER TABLE country_faqs 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ============================================================
-- PHASE 2: CREATE TRIGGER FOR AUTO-UPDATE
-- ============================================================

-- Create BEFORE UPDATE trigger to auto-update the updated_at column
-- This uses the existing update_updated_at_column() function
CREATE TRIGGER update_country_faqs_updated_at 
BEFORE UPDATE ON country_faqs
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PHASE 3: VERIFICATION QUERY
-- ============================================================

-- Test the trigger by updating a FAQ record and checking updated_at changes
-- Run this query to verify:
--
-- -- First, get an existing FAQ and its current updated_at
-- SELECT id, question, updated_at FROM country_faqs LIMIT 1;
--
-- -- Then update it (replace ID with actual FAQ id)
-- UPDATE country_faqs SET answer = answer WHERE id = 'xxx-xxx-xxx-xxx';
--
-- -- Then check that updated_at has changed to NOW()
-- SELECT id, question, updated_at FROM country_faqs WHERE id = 'xxx-xxx-xxx-xxx';
--
-- Expected result: updated_at should be very recent (current time)

-- ============================================================
-- SUMMARY OF CHANGES
-- ============================================================
--
-- Changes:
-- 1. Added updated_at column to country_faqs (if not present)
--    - Type: TIMESTAMPTZ
--    - Default: NOW()
--    - Ensures all records have a timestamp
--
-- 2. Created trigger: update_country_faqs_updated_at
--    - Event: BEFORE UPDATE on country_faqs
--    - Function: update_updated_at_column()
--    - Effect: Automatically sets NEW.updated_at = NOW() on every update
--
-- Benefits:
-- - Automatic tracking of last modification time
-- - No manual timestamp management needed
-- - Consistent with other tables (applications, consultations, blog_posts, etc.)
-- - Useful for cache invalidation, audit trails, and data sync operations
--
-- Consistency:
-- This brings country_faqs into alignment with existing trigger pattern:
--   - countries: ✓ has update_countries_updated_at trigger
--   - visa_programs: ✓ has update_visa_programs_updated_at trigger
--   - user_profiles: ✓ has update_user_profiles_updated_at trigger
--   - applications: ✓ has update_applications_updated_at trigger
--   - consultations: ✓ has update_consultations_updated_at trigger
--   - blog_posts: ✓ has update_blog_posts_updated_at trigger
--   - country_faqs: ✓ NEW - has update_country_faqs_updated_at trigger

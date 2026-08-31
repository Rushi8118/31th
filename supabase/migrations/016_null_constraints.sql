-- Migration: Fix NULL constraints and data integrity issues
-- Purpose: Ensure semantic correctness of NULL constraints across all tables
-- Date: May 27, 2026
-- Severity: High - Improves data integrity and prevents orphaned/invalid records

-- ============================================================
-- PHASE 1: BACKFILL NULL VALUES FOR REQUIRED FIELDS
-- ============================================================

-- 1. COUNTRIES: Ensure code, name, slug are always set (already NOT NULL)
-- Ensure flag_emoji has a default for consistency
UPDATE countries SET flag_emoji = '🌍' WHERE flag_emoji IS NULL;

-- 2. VISA_PROGRAMS: Ensure required descriptive fields
UPDATE visa_programs SET processing_time = 'Not specified' WHERE processing_time IS NULL;
UPDATE visa_programs SET visa_duration = 'Variable' WHERE visa_duration IS NULL;
UPDATE visa_programs SET cost_currency = 'INR' WHERE cost_currency IS NULL AND cost_inr IS NOT NULL;

-- 3. USER_PROFILES: Ensure email is always set (already NOT NULL)
-- Backfill full_name from first_name and last_name if missing
UPDATE user_profiles 
SET full_name = NULLIF(BTRIM(concat_ws(' ', first_name, last_name)), '')
WHERE full_name IS NULL AND (first_name IS NOT NULL OR last_name IS NOT NULL);

-- Default username if still NULL after trigger
UPDATE user_profiles 
SET username = COALESCE(full_name, email)
WHERE username IS NULL OR BTRIM(username) = '';

-- 4. CONSULTATIONS: Ensure contact information
-- For consultations without user_id, require at least phone or whatsapp
-- Backfill email from user_profiles if user_id exists
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS email VARCHAR(255);

UPDATE consultations c
SET email = up.email
FROM user_profiles up
WHERE c.user_id = up.id AND c.email IS NULL;

-- Set phone_number to whatsapp_number if one exists
UPDATE consultations 
SET phone_number = whatsapp_number 
WHERE phone_number IS NULL AND whatsapp_number IS NOT NULL;

-- 5. APPLICATIONS: Ensure application_id is set
-- This should have been done by trigger, but backfill any missing
UPDATE applications a
SET application_id = 'APP-' || to_char(a.created_at, 'DDMMYYYY') || '-' || substr(a.id::text, 1, 8)
WHERE application_id IS NULL;

-- 6. SAVED_PLACES: Ensure at least one item reference is set
-- Delete any saved_places with both country_id and visa_program_id NULL
DELETE FROM saved_places WHERE country_id IS NULL AND visa_program_id IS NULL;

-- 7. INTERACTIONS: Backfill session_id for tracking
UPDATE interactions 
SET session_id = 'SES-' || to_char(created_at, 'DDMMYYYY-HH24MMSS') || '-' || substr(id::text, 1, 8)
WHERE session_id IS NULL;

-- 8. BLOG_POSTS: Ensure content is not empty
-- Update slug from title if missing
UPDATE blog_posts 
SET slug = LOWER(REPLACE(REPLACE(title, ' ', '-'), '--', '-')) || '-' || substr(id::text, 1, 6)
WHERE slug IS NULL OR slug = '';

-- ============================================================
-- PHASE 2: ADD NOT NULL CONSTRAINTS
-- ============================================================

-- COUNTRIES table
ALTER TABLE countries 
  ALTER COLUMN flag_emoji SET NOT NULL;

-- VISA_PROGRAMS table
ALTER TABLE visa_programs 
  ALTER COLUMN processing_time SET NOT NULL,
  ALTER COLUMN visa_duration SET NOT NULL,
  ALTER COLUMN cost_currency SET NOT NULL;

-- USER_PROFILES table
ALTER TABLE user_profiles 
  ALTER COLUMN full_name SET NOT NULL;

-- APPLICATIONS table
ALTER TABLE applications 
  ALTER COLUMN application_id SET NOT NULL;

-- CONSULTATIONS table
ALTER TABLE consultations 
  ADD COLUMN email VARCHAR(255),
  ALTER COLUMN email SET NOT NULL;

-- INTERACTIONS table
ALTER TABLE interactions 
  ALTER COLUMN session_id SET NOT NULL;

-- BLOG_POSTS table
ALTER TABLE blog_posts 
  ALTER COLUMN slug SET NOT NULL;

-- ============================================================
-- PHASE 3: ADD CHECK CONSTRAINTS FOR DEPENDENT FIELDS
-- ============================================================

-- COUNTRIES: Latitude and longitude must both be set or both NULL (geographic pairs)
ALTER TABLE countries 
  ADD CONSTRAINT check_geo_coordinates CHECK (
    (latitude IS NOT NULL AND longitude IS NOT NULL) OR 
    (latitude IS NULL AND longitude IS NULL)
  );

-- VISA_PROGRAMS: Cost fields consistency
ALTER TABLE visa_programs 
  ADD CONSTRAINT check_cost_consistency CHECK (
    (cost_inr IS NOT NULL AND cost_currency IS NOT NULL) OR 
    (cost_inr IS NULL AND cost_currency IS NULL)
  );

-- APPLICATIONS: Timeline must be chronological (submitted -> review -> decision)
ALTER TABLE applications 
  ADD CONSTRAINT check_application_timeline CHECK (
    (submitted_at IS NULL) OR 
    (review_started_at IS NULL OR submitted_at <= review_started_at) AND
    (decision_at IS NULL OR review_started_at <= decision_at)
  );

-- CONSULTATIONS: At least one contact method must be provided
-- Either user_id is set, or phone/whatsapp/email is provided
ALTER TABLE consultations 
  ADD CONSTRAINT check_contact_method CHECK (
    user_id IS NOT NULL OR 
    phone_number IS NOT NULL OR 
    whatsapp_number IS NOT NULL OR
    email IS NOT NULL
  );

-- SAVED_PLACES: Exactly one item type reference must be set
ALTER TABLE saved_places 
  ADD CONSTRAINT check_item_reference CHECK (
    (country_id IS NOT NULL AND visa_program_id IS NULL) OR 
    (country_id IS NULL AND visa_program_id IS NOT NULL)
  );

-- INTERACTIONS: entity_type and entity_id must both be set or both NULL
ALTER TABLE interactions 
  ADD CONSTRAINT check_entity_consistency CHECK (
    (entity_type IS NOT NULL AND entity_id IS NOT NULL) OR 
    (entity_type IS NULL AND entity_id IS NULL)
  );

-- BLOG_POSTS: scheduled_at only meaningful if status is 'scheduled'
ALTER TABLE blog_posts 
  ADD CONSTRAINT check_scheduled_date CHECK (
    (status != 'scheduled' OR scheduled_at IS NOT NULL) AND
    (status != 'published' OR published_at IS NOT NULL)
  );

-- NOTIFICATIONS: read_at can only be set if is_read is true
ALTER TABLE notifications 
  ADD CONSTRAINT check_read_consistency CHECK (
    (is_read = true AND read_at IS NOT NULL) OR 
    (is_read = false AND read_at IS NULL)
  );

-- ============================================================
-- PHASE 4: ADD DEFAULT VALUES FOR CONSISTENCY
-- ============================================================

-- Ensure boolean defaults are consistent
ALTER TABLE country_faqs 
  ALTER COLUMN is_active SET DEFAULT TRUE;

-- ============================================================
-- PHASE 5: VERIFICATION QUERIES
-- ============================================================
-- Run these queries to verify the migration was successful:

-- Check countries with valid data
-- SELECT COUNT(*) as countries_count, COUNT(DISTINCT code) as unique_codes FROM countries;

-- Check for any violations of new constraints (should return 0 rows)
-- SELECT * FROM applications WHERE (submitted_at IS NOT NULL AND review_started_at IS NOT NULL AND submitted_at > review_started_at);
-- SELECT * FROM saved_places WHERE (country_id IS NOT NULL AND visa_program_id IS NOT NULL) OR (country_id IS NULL AND visa_program_id IS NULL);
-- SELECT * FROM consultations WHERE user_id IS NULL AND phone_number IS NULL AND whatsapp_number IS NULL AND email IS NULL;

-- ============================================================
-- SUMMARY OF CHANGES
-- ============================================================
-- 
-- NOT NULL Constraints Added:
-- - countries.flag_emoji (required for emoji display)
-- - visa_programs.processing_time, visa_duration, cost_currency (required context)
-- - user_profiles.full_name (always derivable from first/last or set explicitly)
-- - applications.application_id (generated, never should be NULL)
-- - consultations.email (new field, required for contact)
-- - interactions.session_id (critical for analytics)
-- - blog_posts.slug (must always have unique identifier)
--
-- CHECK Constraints Added (Data Integrity):
-- - Geo-coordinate pairing (both or neither)
-- - Cost consistency (cost + currency together)
-- - Application timeline ordering
-- - Consultation contact method (at least one)
-- - Saved place item reference (exactly one type)
-- - Interaction entity consistency
-- - Blog post status-dependent fields
-- - Notification read state consistency
--
-- Backfill Operations Completed:
-- - Generated missing application_ids
-- - Filled missing session_ids for interactions
-- - Derived full_name from name components
-- - Set default values for optional descriptive fields
-- - Deleted invalid saved_places with no references
-- - Added email column to consultations for contact tracking

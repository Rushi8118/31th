# NULL Constraints & Data Integrity Audit
## Siddhivinayak Overseas Database Schema

**Audit Date:** May 27, 2026  
**Focus:** NULL constraints, optional vs. required data, and CHECK constraints for semantic correctness

---

## EXECUTIVE SUMMARY

| Finding Type | Count | Severity |
|---|---|---|
| Nullable columns that should be NOT NULL | 18 | High |
| Missing inter-field CHECK constraints | 12 | High |
| Conditional field constraints missing | 8 | Medium |
| Status-dependent field constraints | 5 | Medium |
| Inconsistent NULL handling | 6 | Medium |

---

## TABLE 1: COUNTRIES

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **code** | NOT NULL UNIQUE | ✅ Correct | No change | Master identifier, must be unique |
| **name** | NOT NULL | ✅ Correct | No change | Core data, required for UI |
| **slug** | NOT NULL UNIQUE | ✅ Correct | No change | Used in URL routing, must be unique |
| **capital** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Core country data; every active country needs this |
| **region** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Used for filtering and categorization in UI |
| **subregion** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Provides geo-hierarchy; critical for data organization |
| **latitude** | NULL (nullable) | ⚠️ Paired constraint needed | NOT NULL + CHECK | Must pair with longitude for globe rendering |
| **longitude** | NULL (nullable) | ⚠️ Paired constraint needed | NOT NULL + CHECK | Must pair with latitude; both required or both NULL |
| **currency** | NULL (nullable) | ⚠️ Needs inter-field CHECK | Nullable with CHECK | If `currency_code` is set, `currency` must be set |
| **currency_code** | NULL (nullable) | ⚠️ Needs inter-field CHECK | NOT NULL | ISO 3-letter code is fundamental for financial data |
| **language** | NULL (nullable) | ⚠️ Conditional requirement | Nullable | Can be nullable, but if set, should be non-empty string |
| **flag_emoji** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Used in UI for country identification; cannot be missing |
| **description** | NULL (nullable) | ℹ️ Optional but recommended | Nullable with CHECK | Can be NULL, but if status='active' should have content (CHECK) |
| **why_study** | NULL (nullable) | ✅ Correct | No change | Optional marketing content |
| **why_work** | NULL (nullable) | ✅ Correct | No change | Optional marketing content |
| **lifestyle** | NULL (nullable) | ✅ Correct | No change | Optional marketing content |
| **meta_title** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Required for SEO/meta tags |
| **meta_desc** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Required for SEO/meta tags |
| **is_active** | NOT NULL DEFAULT TRUE | ✅ Correct | No change | Good constraint |
| **sort_order** | NULL (default 0) | ✅ Correct | No change | Integer with default works correctly |

### Recommended CHECK Constraints for COUNTRIES

```sql
-- 1. Geo-coordinate pairing
ALTER TABLE countries
ADD CONSTRAINT check_geo_coords_pairing
CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude IS NOT NULL AND longitude IS NOT NULL));

-- 2. Currency code and name consistency
ALTER TABLE countries
ADD CONSTRAINT check_currency_consistency
CHECK ((currency_code IS NULL AND currency IS NULL) OR (currency_code IS NOT NULL AND currency IS NOT NULL));

-- 3. Description requirement for active countries
ALTER TABLE countries
ADD CONSTRAINT check_active_has_description
CHECK (is_active = FALSE OR description IS NOT NULL);

-- 4. Capital requirement for active countries
ALTER TABLE countries
ADD CONSTRAINT check_active_has_capital
CHECK (is_active = FALSE OR capital IS NOT NULL);
```

### Recommended Migrations for COUNTRIES

```sql
-- Make required columns NOT NULL
ALTER TABLE countries
ALTER COLUMN capital SET NOT NULL,
ALTER COLUMN region SET NOT NULL,
ALTER COLUMN subregion SET NOT NULL,
ALTER COLUMN currency_code SET NOT NULL,
ALTER COLUMN flag_emoji SET NOT NULL,
ALTER COLUMN meta_title SET NOT NULL,
ALTER COLUMN meta_desc SET NOT NULL;

-- Set defaults for existing NULLs (before making NOT NULL)
UPDATE countries SET capital = 'Unknown' WHERE capital IS NULL;
UPDATE countries SET region = 'Other' WHERE region IS NULL;
UPDATE countries SET subregion = 'Other' WHERE subregion IS NULL;
UPDATE countries SET currency_code = 'USD' WHERE currency_code IS NULL;
UPDATE countries SET flag_emoji = '🌍' WHERE flag_emoji IS NULL;
UPDATE countries SET meta_title = name WHERE meta_title IS NULL;
UPDATE countries SET meta_desc = SUBSTRING(description, 1, 500) WHERE meta_desc IS NULL;
```

---

## TABLE 2: VISA_PROGRAMS

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PRIMARY KEY | ✅ Correct | No change | Good PK |
| **country_id** | NOT NULL FK | ✅ Correct | No change | Good FK constraint |
| **program_type** | NOT NULL + CHECK | ✅ Correct | No change | Enumerated values validated |
| **name** | NOT NULL | ✅ Correct | No change | Core data required |
| **slug** | NOT NULL | ✅ Correct | No change | URL routing required; unique within country |
| **description** | NOT NULL | ✅ Correct | No change | Core content required |
| **eligibility** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **requirements** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **documents_needed** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **processing_time** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Critical visa info; always needed |
| **visa_duration** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Critical visa info; always needed |
| **cost_inr** | NULL (nullable) | ⚠️ Conditional constraint | Nullable with CHECK | Should have value if `cost_local` is set |
| **cost_local** | NULL (nullable) | ⚠️ Conditional constraint | Nullable with CHECK | Should have value if `cost_inr` is set |
| **cost_currency** | NULL (nullable) | ⚠️ Needs CHECK | Nullable with CHECK | Required if any cost field is set |
| **success_rate** | NULL (nullable) | ✅ Correct | Nullable | Optional statistic |
| **pathway_to_pr** | BOOLEAN DEFAULT FALSE | ✅ Correct | No change | Good default |
| **spousal_rights** | BOOLEAN DEFAULT FALSE | ✅ Correct | No change | Good default |
| **work_while_study** | BOOLEAN DEFAULT FALSE | ✅ Correct | No change | Good default |
| **post_study_work** | NULL (nullable) | ✅ Correct | Nullable | Optional field |
| **popular_sectors** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **universities** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **faq** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **meta_title** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Required for SEO |
| **meta_desc** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Required for SEO |
| **is_active** | NOT NULL DEFAULT TRUE | ✅ Correct | No change | Good constraint |

### Recommended CHECK Constraints for VISA_PROGRAMS

```sql
-- 1. Cost consistency: if any cost field is set, all related fields must be consistent
ALTER TABLE visa_programs
ADD CONSTRAINT check_cost_consistency
CHECK (
  (cost_inr IS NULL AND cost_local IS NULL AND cost_currency IS NULL) OR
  (cost_inr IS NOT NULL OR cost_local IS NOT NULL) AND cost_currency IS NOT NULL
);

-- 2. Cost order: cost_inr should typically be <= cost_local (if both set)
ALTER TABLE visa_programs
ADD CONSTRAINT check_cost_comparison
CHECK (cost_inr IS NULL OR cost_local IS NULL OR cost_inr <= cost_local);

-- 3. Success rate range
ALTER TABLE visa_programs
ADD CONSTRAINT check_success_rate_range
CHECK (success_rate IS NULL OR (success_rate >= 0 AND success_rate <= 100));

-- 4. Description requirement for active programs
ALTER TABLE visa_programs
ADD CONSTRAINT check_active_has_content
CHECK (is_active = FALSE OR length(description) >= 20);
```

### Recommended Migrations for VISA_PROGRAMS

```sql
-- Make required columns NOT NULL
ALTER TABLE visa_programs
ALTER COLUMN processing_time SET NOT NULL,
ALTER COLUMN visa_duration SET NOT NULL,
ALTER COLUMN meta_title SET NOT NULL,
ALTER COLUMN meta_desc SET NOT NULL;

-- Set defaults for existing NULLs
UPDATE visa_programs SET processing_time = '2-4 weeks' WHERE processing_time IS NULL;
UPDATE visa_programs SET visa_duration = 'Varies' WHERE visa_duration IS NULL;
UPDATE visa_programs SET meta_title = name WHERE meta_title IS NULL;
UPDATE visa_programs SET meta_desc = SUBSTRING(description, 1, 500) WHERE meta_desc IS NULL;
```

---

## TABLE 3: USER_PROFILES

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PK (FK to auth.users) | ✅ Correct | No change | Good constraint |
| **email** | NOT NULL | ✅ Correct | No change | Core identifier required |
| **full_name** | NULL (nullable) | ⚠️ Conditional + default | Nullable | Can derive from first/last via trigger; OK if managed |
| **first_name** | NULL (nullable) | ⚠️ Should have constraint | Nullable with CHECK | If full_name is NULL, first_name should be NOT NULL |
| **last_name** | NULL (nullable) | ✅ Correct | Nullable | Not always required (single names) |
| **username** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Trigger generates default; enforce non-NULL |
| **welcome_email_sent_at** | NULL (nullable) | ✅ Correct | Nullable | Optional audit timestamp |
| **phone** | NULL (nullable) | ⚠️ Needs inter-field CHECK | Nullable with CHECK | At least one contact method required (phone OR whatsapp) |
| **whatsapp** | NULL (nullable) | ⚠️ Needs inter-field CHECK | Nullable with CHECK | At least one contact method required (phone OR whatsapp) |
| **gender** | NULL (nullable) | ✅ Correct | Nullable | Optional demographic data |
| **nationality** | NULL (nullable) | ✅ Correct | Nullable | Optional; users may not fill this |
| **current_city** | NULL (nullable) | ✅ Correct | Nullable | Optional; changes frequently |
| **current_country** | NULL (nullable) | ✅ Correct | Nullable | Optional; may not be set |
| **education_level** | NULL (nullable) | ✅ Correct | Nullable | Optional; set during onboarding |
| **field_of_study** | NULL (nullable) | ✅ Correct | Nullable | Optional; depends on education_level |
| **profile_photo_url** | NULL (nullable) | ✅ Correct | Nullable | Optional image |
| **onboarding_complete** | BOOLEAN DEFAULT FALSE | ✅ Correct | No change | Good default |
| **user_role** | NOT NULL DEFAULT 'user' | ✅ Correct | No change | Good constraint |
| **status** | NOT NULL DEFAULT 'active' | ✅ Correct | No change | Good constraint |
| **last_login_at** | NULL (nullable) | ✅ Correct | Nullable | Optional audit field |

### Recommended CHECK Constraints for USER_PROFILES

```sql
-- 1. At least one name field must be provided
ALTER TABLE user_profiles
ADD CONSTRAINT check_name_required
CHECK (full_name IS NOT NULL OR (first_name IS NOT NULL AND last_name IS NOT NULL));

-- 2. At least one contact method (phone or whatsapp)
ALTER TABLE user_profiles
ADD CONSTRAINT check_contact_required
CHECK (phone IS NOT NULL OR whatsapp IS NOT NULL);

-- 3. Username cannot be empty string (redundancy but good safeguard)
ALTER TABLE user_profiles
ADD CONSTRAINT check_username_not_empty
CHECK (username IS NOT NULL AND length(btrim(username)) > 0);

-- 4. If deleted, last_login_at should be in past relative to deletion time
-- (This would require tracking deletion time, possibly via status update at)
```

### Recommended Migrations for USER_PROFILES

```sql
-- Make username NOT NULL (trigger generates defaults)
ALTER TABLE user_profiles
ALTER COLUMN username SET NOT NULL;

-- Populate username for existing NULLs
UPDATE user_profiles 
SET username = COALESCE(full_name, concat_ws(' ', first_name, last_name), email)
WHERE username IS NULL OR btrim(username) = '';

-- Set phone to whatsapp for users with only whatsapp
UPDATE user_profiles 
SET phone = whatsapp 
WHERE phone IS NULL AND whatsapp IS NOT NULL 
AND (SELECT COUNT(*) FROM user_profiles) > 0;
```

---

## TABLE 4: APPLICATIONS

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PK | ✅ Correct | No change | Good PK |
| **application_id** | UNIQUE (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Generated by trigger; should enforce post-creation |
| **user_id** | NOT NULL FK | ✅ Correct | No change | Good constraint |
| **visa_program_id** | NOT NULL FK | ✅ Correct | No change | Good constraint |
| **country_id** | NOT NULL FK | ✅ Correct | No change | Good constraint |
| **application_type** | NOT NULL + CHECK | ✅ Correct | No change | Good constraint |
| **status** | NOT NULL DEFAULT 'draft' | ✅ Correct | No change | Good constraint |
| **priority** | VARCHAR(20) DEFAULT 'normal' | ✅ Correct | No change | Good default |
| **personal_info** | JSONB DEFAULT '{}' | ✅ Correct | No change | Good default |
| **education_history** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **work_history** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **document_checklist** | JSONB DEFAULT '{}' | ✅ Correct | No change | Good default |
| **submitted_at** | NULL (nullable) | ⚠️ Status-dependent constraint | NOT NULL after submission | Should be set when status != 'draft' |
| **review_started_at** | NULL (nullable) | ⚠️ Status-dependent constraint | NOT NULL after review starts | Should be set when status in ('under_review','approved','rejected') |
| **decision_at** | NULL (nullable) | ⚠️ Status-dependent constraint | NOT NULL after decision | Should be set when status in ('approved','rejected') |
| **estimated_completion** | NULL (nullable) | ✅ Correct | Nullable | Optional estimate |
| **assigned_consultant** | NULL FK | ✅ Correct | Nullable | Optional assignment |
| **consultant_notes** | NULL (nullable) | ✅ Correct | Nullable | Optional internal notes |

### Recommended CHECK Constraints for APPLICATIONS

```sql
-- 1. Timeline consistency: submitted_at must be before review_started_at
ALTER TABLE applications
ADD CONSTRAINT check_submission_before_review
CHECK (submitted_at IS NULL OR review_started_at IS NULL OR submitted_at <= review_started_at);

-- 2. Timeline consistency: review_started_at must be before decision_at
ALTER TABLE applications
ADD CONSTRAINT check_review_before_decision
CHECK (review_started_at IS NULL OR decision_at IS NULL OR review_started_at <= decision_at);

-- 3. Status-submitted consistency
ALTER TABLE applications
ADD CONSTRAINT check_submitted_status_consistency
CHECK (
  status = 'draft' OR submitted_at IS NOT NULL
);

-- 4. Status-under_review consistency
ALTER TABLE applications
ADD CONSTRAINT check_under_review_consistency
CHECK (
  status NOT IN ('under_review','approved','rejected') OR review_started_at IS NOT NULL
);

-- 5. Status-decision consistency
ALTER TABLE applications
ADD CONSTRAINT check_decision_consistency
CHECK (
  status NOT IN ('approved','rejected') OR decision_at IS NOT NULL
);

-- 6. Withdrawn or rejected cannot have future estimated_completion
ALTER TABLE applications
ADD CONSTRAINT check_completion_for_active_status
CHECK (
  status IN ('draft','submitted','under_review') OR estimated_completion IS NULL
);

-- 7. Withdrawn status means submitted but not completed
ALTER TABLE applications
ADD CONSTRAINT check_withdrawn_has_submission
CHECK (
  status != 'withdrawn' OR submitted_at IS NOT NULL
);
```

### Recommended Migrations for APPLICATIONS

```sql
-- Make application_id NOT NULL (after ensuring all are generated)
-- First, generate missing IDs:
UPDATE applications
SET application_id = (
  SELECT country_code || to_char(created_at, 'DDMMYYYY') || lpad((row_number() OVER (ORDER BY id))::text, 2, '0')
  FROM (SELECT code as country_code FROM countries WHERE id = applications.country_id LIMIT 1) t
)
WHERE application_id IS NULL;

ALTER TABLE applications
ALTER COLUMN application_id SET NOT NULL;
```

---

## TABLE 5: CONSULTATIONS

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PK | ✅ Correct | No change | Good PK |
| **user_id** | NULL FK (ON DELETE SET NULL) | ⚠️ Needs paired constraint | Nullable with CHECK | If NULL, must have phone_number OR whatsapp_number |
| **assigned_consultant** | NULL FK | ✅ Correct | Nullable | Optional, assigned later |
| **consultation_type** | NOT NULL + CHECK | ✅ Correct | No change | Good constraint |
| **status** | NOT NULL + CHECK | ✅ Correct | No change | Good constraint |
| **scheduled_at** | NOT NULL DEFAULT NOW() | ✅ Correct | No change | Good constraint |
| **duration_minutes** | INT DEFAULT 30 | ✅ Correct | Nullable with CHECK | Should be positive integer (CHECK) |
| **timezone** | VARCHAR(50) DEFAULT 'Asia/Kolkata' | ✅ Correct | No change | Good default |
| **phone_number** | NULL (nullable) | ⚠️ Contact required | Nullable with CHECK | At least one contact method (phone or whatsapp or user_id) |
| **whatsapp_number** | NULL (nullable) | ⚠️ Contact required | Nullable with CHECK | At least one contact method (phone or whatsapp or user_id) |
| **preferred_country** | NULL (nullable) | ✅ Correct | Nullable | Optional consultation topic |
| **visa_category** | NULL (nullable) | ✅ Correct | Nullable | Optional consultation topic |
| **user_notes** | JSONB DEFAULT '{}' | ✅ Correct | No change | Good default |
| **consultant_notes** | NULL (nullable) | ✅ Correct | Nullable | Optional internal notes |
| **follow_up_needed** | BOOLEAN DEFAULT FALSE | ✅ Correct | No change | Good default |
| **follow_up_date** | NULL (nullable) | ⚠️ Status-dependent | NOT NULL if follow_up_needed=true | Should be set if follow_up_needed is TRUE |
| **rating** | NULL with CHECK (1-5) | ⚠️ Status-dependent | NOT NULL if status='completed' | Should be set only after completion |
| **feedback** | NULL (nullable) | ⚠️ Status-dependent | NOT NULL if status='completed' | Should be set only after completion |

### Recommended CHECK Constraints for CONSULTATIONS

```sql
-- 1. At least one contact method required (user_id OR phone OR whatsapp)
ALTER TABLE consultations
ADD CONSTRAINT check_contact_required
CHECK (user_id IS NOT NULL OR phone_number IS NOT NULL OR whatsapp_number IS NOT NULL);

-- 2. Duration must be positive
ALTER TABLE consultations
ADD CONSTRAINT check_duration_positive
CHECK (duration_minutes IS NULL OR duration_minutes > 0);

-- 3. Follow-up date consistency
ALTER TABLE consultations
ADD CONSTRAINT check_followup_consistency
CHECK (
  follow_up_needed = FALSE OR follow_up_date IS NOT NULL
);

-- 4. Follow-up date must be in future
ALTER TABLE consultations
ADD CONSTRAINT check_followup_future
CHECK (
  follow_up_date IS NULL OR follow_up_date > scheduled_at::date
);

-- 5. Rating only for completed consultations
ALTER TABLE consultations
ADD CONSTRAINT check_rating_on_completion
CHECK (
  status != 'completed' OR (rating IS NOT NULL AND rating >= 1 AND rating <= 5)
);

-- 6. Feedback only for completed or cancelled with reason
ALTER TABLE consultations
ADD CONSTRAINT check_feedback_consistency
CHECK (
  status NOT IN ('completed', 'no_show') OR feedback IS NOT NULL
);

-- 7. Scheduled_at must be in future for 'scheduled', 'confirmed' status
ALTER TABLE consultations
ADD CONSTRAINT check_scheduled_future
CHECK (
  status NOT IN ('scheduled', 'confirmed') OR scheduled_at > NOW()
);
```

### Recommended Migrations for CONSULTATIONS

```sql
-- For existing consultations with follow_up_needed=true but no date:
UPDATE consultations 
SET follow_up_date = (scheduled_at + INTERVAL '1 week')::date
WHERE follow_up_needed = TRUE AND follow_up_date IS NULL;

-- For completed consultations with no rating:
UPDATE consultations 
SET rating = 5 
WHERE status = 'completed' AND rating IS NULL;
```

---

## TABLE 6: SAVED_PLACES

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PK | ✅ Correct | No change | Good PK |
| **user_id** | NOT NULL FK | ✅ Correct | No change | Good constraint |
| **item_type** | NOT NULL + CHECK | ✅ Correct | No change | Enumerated correctly |
| **country_id** | NULL FK | ⚠️ Type-dependent constraint | NOT NULL if item_type='country' | Only set for country items |
| **visa_program_id** | NULL FK | ⚠️ Type-dependent constraint | NOT NULL if item_type='visa_program' | Only set for program items |
| **notes** | NULL (nullable) | ✅ Correct | Nullable | Optional user notes |
| **UNIQUE constraint** | (user_id, item_type, country_id, visa_program_id) | ⚠️ Incorrect logic | Needs redefine | Current constraint allows invalid combinations |

### Recommended CHECK Constraints for SAVED_PLACES

```sql
-- 1. Item type and ID consistency
ALTER TABLE saved_places
ADD CONSTRAINT check_item_type_consistency
CHECK (
  (item_type = 'country' AND country_id IS NOT NULL AND visa_program_id IS NULL) OR
  (item_type = 'visa_program' AND country_id IS NOT NULL AND visa_program_id IS NOT NULL)
);

-- 2. Better UNIQUE constraint for each type
DROP CONSTRAINT IF EXISTS saved_places_user_item_type_country_id_visa_program_id_key;

-- For countries:
CREATE UNIQUE INDEX idx_saved_places_user_country 
ON saved_places(user_id, country_id) 
WHERE item_type = 'country';

-- For programs:
CREATE UNIQUE INDEX idx_saved_places_user_program 
ON saved_places(user_id, visa_program_id) 
WHERE item_type = 'visa_program';
```

### Recommended Migrations for SAVED_PLACES

```sql
-- Remove invalid records (visa_program without visa_program_id)
DELETE FROM saved_places
WHERE item_type = 'visa_program' AND visa_program_id IS NULL;

-- Remove invalid records (country with visa_program_id)
DELETE FROM saved_places
WHERE item_type = 'country' AND visa_program_id IS NOT NULL;

-- Make columns NOT NULL where needed (after cleanup)
ALTER TABLE saved_places
ALTER COLUMN country_id SET NOT NULL;
```

---

## TABLE 7: INTERACTIONS

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PK | ✅ Correct | No change | Good PK |
| **user_id** | NULL FK (SET NULL) | ⚠️ Needs paired constraint | Nullable with CHECK | At least user_id OR session_id must be set |
| **session_id** | NULL (nullable) | ⚠️ Needs paired constraint | Nullable with CHECK | At least session_id OR user_id must be set |
| **event_type** | NOT NULL + CHECK | ✅ Correct | No change | Good constraint |
| **entity_type** | NULL (nullable) | ⚠️ Paired constraint | NOT NULL if event_type involves entities | Should be set for entity-specific events |
| **entity_id** | NULL (nullable) | ⚠️ Paired constraint | NOT NULL if entity_type is set | Both should be set or both NULL |
| **page_path** | NULL (nullable) | ⚠️ Conditional | NOT NULL for page_view events | Should be set for page-related events |
| **page_title** | NULL (nullable) | ✅ Correct | Nullable | Optional |
| **referrer** | NULL (nullable) | ✅ Correct | Nullable | Optional tracking |
| **device_type** | NULL (nullable) | ✅ Correct | Nullable | Optional; may not be known |
| **browser** | NULL (nullable) | ✅ Correct | Nullable | Optional; may not be known |
| **country_code** | NULL (nullable) | ✅ Correct | Nullable | Optional; may not be known |
| **globe_lat** | NULL (nullable) | ⚠️ Paired constraint | NOT NULL if globe_lng is set | Both coordinates should exist together |
| **globe_lng** | NULL (nullable) | ⚠️ Paired constraint | NOT NULL if globe_lat is set | Both coordinates should exist together |
| **metadata** | JSONB DEFAULT '{}' | ✅ Correct | No change | Good default |
| **created_at** | NOT NULL DEFAULT NOW() | ✅ Correct | No change | Good constraint |

### Recommended CHECK Constraints for INTERACTIONS

```sql
-- 1. Either authenticated user or anonymous session required
ALTER TABLE interactions
ADD CONSTRAINT check_user_or_session
CHECK (user_id IS NOT NULL OR session_id IS NOT NULL);

-- 2. Entity type and ID must both be set or both be NULL
ALTER TABLE interactions
ADD CONSTRAINT check_entity_consistency
CHECK (
  (entity_type IS NULL AND entity_id IS NULL) OR
  (entity_type IS NOT NULL AND entity_id IS NOT NULL)
);

-- 3. Page-related events must have page_path
ALTER TABLE interactions
ADD CONSTRAINT check_page_event_has_path
CHECK (
  event_type NOT IN ('page_view', 'document_download') OR page_path IS NOT NULL
);

-- 4. Globe interactions require coordinates
ALTER TABLE interactions
ADD CONSTRAINT check_globe_has_coords
CHECK (
  event_type != 'globe_interaction' OR (globe_lat IS NOT NULL AND globe_lng IS NOT NULL)
);

-- 5. Geo coordinates must be both set or both NULL
ALTER TABLE interactions
ADD CONSTRAINT check_geo_coords_pairing
CHECK (
  (globe_lat IS NULL AND globe_lng IS NULL) OR
  (globe_lat IS NOT NULL AND globe_lng IS NOT NULL)
);

-- 6. Valid coordinate ranges
ALTER TABLE interactions
ADD CONSTRAINT check_geo_coords_valid
CHECK (
  globe_lat IS NULL OR (globe_lat >= -90 AND globe_lat <= 90)
  AND globe_lng IS NULL OR (globe_lng >= -180 AND globe_lng <= 180)
);

-- 7. Entity_type must reference valid tables
ALTER TABLE interactions
ADD CONSTRAINT check_entity_type_valid
CHECK (entity_type IN ('country', 'visa_program', 'page', 'globe') OR entity_type IS NULL);
```

### Recommended Migrations for INTERACTIONS

```sql
-- Generate session_ids for anonymous interactions without user_id or session_id
UPDATE interactions 
SET session_id = gen_random_uuid()::text
WHERE user_id IS NULL AND session_id IS NULL;

-- Assign page_path for page_view events without it
UPDATE interactions 
SET page_path = '/'
WHERE event_type = 'page_view' AND page_path IS NULL;
```

---

## TABLE 8: BLOG_POSTS

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PK | ✅ Correct | No change | Good PK |
| **author_id** | NULL FK (SET NULL) | ✅ Correct | Nullable | Optional; may be system-generated |
| **title** | NOT NULL | ✅ Correct | No change | Core required |
| **slug** | NOT NULL UNIQUE | ✅ Correct | No change | URL routing required |
| **excerpt** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL for published posts | Should be set for all posts, especially published |
| **content** | NOT NULL | ✅ Correct | No change | Core required |
| **category** | NOT NULL DEFAULT 'general' | ✅ Correct | No change | Good constraint |
| **tags** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **related_countries** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **related_programs** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **featured_image** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL for published posts | Visual required in UI |
| **gallery** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **meta_title** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Required for SEO |
| **meta_desc** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Required for SEO |
| **keywords** | JSONB DEFAULT '[]' | ✅ Correct | No change | Good default |
| **canonical_url** | NULL (nullable) | ✅ Correct | Nullable | Optional; defaults to post URL |
| **status** | NOT NULL DEFAULT 'draft' | ✅ Correct | No change | Good constraint |
| **published_at** | NULL (nullable) | ⚠️ Status-dependent | NOT NULL if status='published' | Should be set when published |
| **scheduled_at** | NULL (nullable) | ⚠️ Status-dependent | NOT NULL if status='scheduled' | Should be set for scheduled posts |
| **view_count** | NOT NULL DEFAULT 0 | ✅ Correct | No change | Good constraint |
| **like_count** | NOT NULL DEFAULT 0 | ✅ Correct | No change | Good constraint |
| **share_count** | NOT NULL DEFAULT 0 | ✅ Correct | No change | Good constraint |

### Recommended CHECK Constraints for BLOG_POSTS

```sql
-- 1. Published posts must have publication timestamp
ALTER TABLE blog_posts
ADD CONSTRAINT check_published_has_timestamp
CHECK (
  status != 'published' OR published_at IS NOT NULL
);

-- 2. Scheduled posts must have scheduled timestamp
ALTER TABLE blog_posts
ADD CONSTRAINT check_scheduled_has_timestamp
CHECK (
  status != 'scheduled' OR scheduled_at IS NOT NULL
);

-- 3. Published posts must have been scheduled in past
ALTER TABLE blog_posts
ADD CONSTRAINT check_published_scheduled_past
CHECK (
  status != 'published' OR published_at <= NOW()
);

-- 4. Scheduled posts must be in future
ALTER TABLE blog_posts
ADD CONSTRAINT check_scheduled_in_future
CHECK (
  status != 'scheduled' OR scheduled_at > NOW()
);

-- 5. Published posts need core content
ALTER TABLE blog_posts
ADD CONSTRAINT check_published_has_excerpt
CHECK (
  status != 'published' OR excerpt IS NOT NULL
);

-- 6. Excerpt must be shorter than content (sanity check)
ALTER TABLE blog_posts
ADD CONSTRAINT check_excerpt_shorter
CHECK (
  excerpt IS NULL OR length(excerpt) <= length(content)
);

-- 7. Meta fields present for published posts
ALTER TABLE blog_posts
ADD CONSTRAINT check_published_has_meta
CHECK (
  status != 'published' OR (meta_title IS NOT NULL AND meta_desc IS NOT NULL)
);

-- 8. Featured image present for published posts
ALTER TABLE blog_posts
ADD CONSTRAINT check_published_has_image
CHECK (
  status != 'published' OR featured_image IS NOT NULL
);

-- 9. Engagement counts are non-negative
ALTER TABLE blog_posts
ADD CONSTRAINT check_engagement_nonnegative
CHECK (
  view_count >= 0 AND like_count >= 0 AND share_count >= 0
);
```

### Recommended Migrations for BLOG_POSTS

```sql
-- For published posts without meta_title, generate from title
UPDATE blog_posts 
SET meta_title = SUBSTRING(title, 1, 60)
WHERE status = 'published' AND meta_title IS NULL;

-- For published posts without meta_desc, generate from excerpt/content
UPDATE blog_posts 
SET meta_desc = SUBSTRING(COALESCE(excerpt, content), 1, 160)
WHERE status = 'published' AND meta_desc IS NULL;

-- For published posts without excerpt, generate from content
UPDATE blog_posts 
SET excerpt = SUBSTRING(content, 1, 500)
WHERE status = 'published' AND excerpt IS NULL;

-- For published posts without featured_image, set placeholder
UPDATE blog_posts 
SET featured_image = '/images/default-blog-cover.png'
WHERE status = 'published' AND featured_image IS NULL;
```

---

## TABLE 9: NOTIFICATIONS

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PK | ✅ Correct | No change | Good PK |
| **user_id** | NOT NULL FK | ✅ Correct | No change | Good constraint |
| **type** | NOT NULL + CHECK | ✅ Correct | No change | Good constraint |
| **title** | NOT NULL | ✅ Correct | No change | Core required |
| **message** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Should always have message body |
| **action_url** | NULL (nullable) | ⚠️ Paired constraint | Nullable with CHECK | If action_label is set, action_url must be set |
| **action_label** | NULL (nullable) | ⚠️ Paired constraint | Nullable with CHECK | If action_url is set, action_label must be set |
| **is_read** | NOT NULL DEFAULT FALSE | ✅ Correct | No change | Good constraint |
| **read_at** | NULL (nullable) | ⚠️ Status-dependent | NOT NULL if is_read=true | Should be set when read |
| **created_at** | NOT NULL DEFAULT NOW() | ✅ Correct | No change | Good constraint |

### Recommended CHECK Constraints for NOTIFICATIONS

```sql
-- 1. Action URL and label consistency
ALTER TABLE notifications
ADD CONSTRAINT check_action_consistency
CHECK (
  (action_url IS NULL AND action_label IS NULL) OR
  (action_url IS NOT NULL AND action_label IS NOT NULL)
);

-- 2. Read status and timestamp consistency
ALTER TABLE notifications
ADD CONSTRAINT check_read_consistency
CHECK (
  is_read = FALSE OR read_at IS NOT NULL
);

-- 3. Read timestamp cannot be before creation
ALTER TABLE notifications
ADD CONSTRAINT check_read_after_creation
CHECK (
  read_at IS NULL OR read_at >= created_at
);

-- 4. Message must have content
ALTER TABLE notifications
ADD CONSTRAINT check_message_not_empty
CHECK (
  message IS NULL OR length(btrim(message)) > 0
);

-- 5. Title must have content
ALTER TABLE notifications
ADD CONSTRAINT check_title_not_empty
CHECK (
  length(btrim(title)) > 0
);
```

### Recommended Migrations for NOTIFICATIONS

```sql
-- Set message to default value for existing NULLs
UPDATE notifications 
SET message = title
WHERE message IS NULL;

-- Set read_at for existing read notifications without timestamp
UPDATE notifications 
SET read_at = created_at
WHERE is_read = TRUE AND read_at IS NULL;

-- Make message NOT NULL after cleanup
ALTER TABLE notifications
ALTER COLUMN message SET NOT NULL;
```

---

## TABLE 10: COUNTRY_FAQS

### Current State Analysis

| Column | Current Constraint | Issue Type | Proposed Constraint | Rationale |
|---|---|---|---|---|
| **id** | UUID PK | ✅ Correct | No change | Good PK |
| **country_id** | NOT NULL FK | ✅ Correct | No change | Good constraint |
| **question** | NOT NULL | ✅ Correct | No change | Core required |
| **answer** | NOT NULL | ✅ Correct | No change | Core required |
| **category** | NULL (nullable) | ⚠️ Should be NOT NULL | NOT NULL | Should categorize FAQs for organization |
| **sort_order** | INT DEFAULT 0 | ✅ Correct | No change | Good default |
| **is_active** | BOOLEAN DEFAULT TRUE | ⚠️ Should NOT NULL | NOT NULL DEFAULT TRUE | Should be explicit |
| **created_at** | NOT NULL DEFAULT NOW() | ✅ Correct | No change | Good constraint |

### Recommended CHECK Constraints for COUNTRY_FAQS

```sql
-- 1. Question must be non-empty
ALTER TABLE country_faqs
ADD CONSTRAINT check_question_not_empty
CHECK (length(btrim(question)) > 0);

-- 2. Answer must be non-empty
ALTER TABLE country_faqs
ADD CONSTRAINT check_answer_not_empty
CHECK (length(btrim(answer)) > 0);

-- 3. Sort order must be non-negative
ALTER TABLE country_faqs
ADD CONSTRAINT check_sort_order_nonnegative
CHECK (sort_order >= 0);

-- 4. Inactive FAQs might want to track why (consider adding reason field)
-- For now, ensure inactive has rationale in answer or note
```

### Recommended Migrations for COUNTRY_FAQS

```sql
-- Make is_active explicitly NOT NULL
ALTER TABLE country_faqs
ALTER COLUMN is_active SET NOT NULL;

-- Make category NOT NULL with default
ALTER TABLE country_faqs
ALTER COLUMN category SET NOT NULL DEFAULT 'general';

-- Update existing NULLs
UPDATE country_faqs 
SET category = 'general' 
WHERE category IS NULL;
```

---

## CROSS-TABLE CONSTRAINT ANALYSIS

### Referential Integrity

| FK Relationship | Current | Status | Issue |
|---|---|---|---|
| applications → user_profiles | ON DELETE CASCADE | ✅ Correct | Applications deleted with user |
| applications → visa_programs | ON DELETE RESTRICT | ✅ Correct | Prevents deleting in-use programs |
| applications → countries | ON DELETE RESTRICT | ✅ Correct | Prevents deleting in-use countries |
| consultations → user_profiles | ON DELETE SET NULL | ⚠️ Review | Allow orphaned consultations, but violate CHECK if no contact info |
| saved_places → user_profiles | ON DELETE CASCADE | ✅ Correct | Saved items deleted with user |
| saved_places → countries | ON DELETE CASCADE | ✅ Correct | Cleanup when country removed |
| saved_places → visa_programs | ON DELETE CASCADE | ✅ Correct | Cleanup when program removed |
| blog_posts → user_profiles | ON DELETE SET NULL | ✅ Correct | Blog posts retained as system content |

---

## SUMMARY OF RECOMMENDED CHANGES

### Priority 1: CRITICAL (Data Integrity)

1. **APPLICATIONS table**
   - Add CHECK constraints for timeline consistency (submitted_at, review_started_at, decision_at)
   - Make `application_id` NOT NULL
   - Add status-dependent field validation

2. **SAVED_PLACES table**
   - Add CHECK constraints for item_type consistency with IDs
   - Fix UNIQUE constraint logic
   - Make `country_id` NOT NULL

3. **CONSULTATIONS table**
   - Add CHECK for contact requirement (user_id OR phone OR whatsapp)
   - Add CHECK for follow_up_date only if follow_up_needed
   - Add CHECK for rating/feedback only on completion

### Priority 2: HIGH (Data Quality)

4. **COUNTRIES table**
   - Make `capital`, `region`, `subregion`, `currency_code`, `flag_emoji` NOT NULL
   - Add CHECK for geo-coordinate pairing
   - Add CHECK for description on active countries

5. **VISA_PROGRAMS table**
   - Make `processing_time`, `visa_duration`, `meta_title`, `meta_desc` NOT NULL
   - Add CHECK for cost field consistency

6. **BLOG_POSTS table**
   - Add CHECK constraints for published post requirements
   - Set defaults for published posts (excerpt, featured_image, meta fields)

### Priority 3: MEDIUM (Best Practices)

7. **USER_PROFILES table**
   - Make `username` NOT NULL
   - Add CHECK for contact requirements (phone OR whatsapp)

8. **NOTIFICATIONS table**
   - Make `message` NOT NULL
   - Add CHECK for action_url/action_label pairing

9. **COUNTRY_FAQS table**
   - Make `is_active` NOT NULL DEFAULT TRUE
   - Make `category` NOT NULL with default

### Priority 4: PERFORMANCE/AUDIT

10. **INTERACTIONS table**
    - Add CHECK for user_id or session_id requirement
    - Add CHECK for entity_type/entity_id pairing
    - Add validation for geographic coordinates

---

## IMPLEMENTATION ROADMAP

### Phase 1: Analysis & Validation (Week 1)
- Review findings with team
- Validate business logic with stakeholders
- Test proposed CHECK constraints on development database

### Phase 2: Data Cleanup (Week 2)
- Run data migration scripts for populated tables
- Validate data quality post-migration
- Document any manual interventions needed

### Phase 3: Constraint Deployment (Week 3)
- Deploy NOT NULL changes via migration
- Deploy CHECK constraints
- Verify application still functions correctly

### Phase 4: Testing & Verification (Week 4)
- Test error handling in application layer
- Verify validation messages are user-friendly
- Load test with constraints enabled

---

## ADDITIONAL RECOMMENDATIONS

1. **Add created_at triggers** for all tables that currently lack update tracking
2. **Add soft-delete capability** for user_profiles, applications (status field already in place)
3. **Add audit logging** for sensitive table changes (user_profiles, applications, consultations)
4. **Create views** for common queries with filtered data (active records only, user dashboard, etc.)
5. **Add domain constraints** for email validation at database level if not handled by application
6. **Monitor constraint violations** in production; log and alert on check failures


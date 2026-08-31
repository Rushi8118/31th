-- ============================================================
-- FIX: ADD URGENT_REQUIREMENTS TABLE AND RLS POLICIES
-- Run this in Supabase SQL Editor to fix the 404 errors
-- ============================================================

-- Step 1: Create the urgent_requirements table
CREATE TABLE IF NOT EXISTS urgent_requirements (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    country         TEXT NOT NULL,
    country_code    TEXT NOT NULL DEFAULT 'XX',
    category        TEXT NOT NULL,
    vacancies       INTEGER NOT NULL DEFAULT 1,
    salary          TEXT NOT NULL,
    experience_required TEXT,
    image_url       TEXT,
    summary         TEXT,
    content         TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'expired')),
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_status ON urgent_requirements(status);
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_country ON urgent_requirements(country);
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_expires_at ON urgent_requirements(expires_at);
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_slug ON urgent_requirements(slug);
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_created_at ON urgent_requirements(created_at DESC);

-- Step 3: Enable Row Level Security
ALTER TABLE urgent_requirements ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active urgent requirements" ON urgent_requirements;
DROP POLICY IF EXISTS "Authenticated users can manage urgent requirements" ON urgent_requirements;

-- Step 5: Create RLS policies

-- Policy 1: Public (anonymous) users can ONLY read active, non-expired requirements
CREATE POLICY "Public can view active urgent requirements"
ON urgent_requirements
FOR SELECT
TO anon, authenticated
USING (
    status = 'active' 
    AND (expires_at IS NULL OR expires_at > NOW())
);

-- Policy 2: Authenticated users can do everything (for admin panel)
CREATE POLICY "Authenticated users can manage urgent requirements"
ON urgent_requirements
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 6: Create update trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_urgent_requirements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_urgent_requirements_updated_at ON urgent_requirements;

CREATE TRIGGER trigger_urgent_requirements_updated_at
BEFORE UPDATE ON urgent_requirements
FOR EACH ROW
EXECUTE FUNCTION update_urgent_requirements_updated_at();

-- Step 7: Grant permissions
GRANT SELECT ON urgent_requirements TO anon;
GRANT ALL ON urgent_requirements TO authenticated;
GRANT ALL ON urgent_requirements TO service_role;

-- ============================================================
-- VERIFICATION: Check if everything is set up correctly
-- ============================================================

-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'urgent_requirements'
) AS table_exists;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'urgent_requirements';

-- Check policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'urgent_requirements';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see no errors above, the table has been created successfully!
-- The admin panel should now be able to save urgent requirements to the database.
-- Public users will only see active requirements that haven't expired.

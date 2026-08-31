-- ============================================================
-- ADD URGENT_REQUIREMENTS TABLE
-- This table stores urgent job/visa openings displayed on the website
-- ============================================================

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_status ON urgent_requirements(status);
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_country ON urgent_requirements(country);
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_expires_at ON urgent_requirements(expires_at);
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_slug ON urgent_requirements(slug);
CREATE INDEX IF NOT EXISTS idx_urgent_requirements_created_at ON urgent_requirements(created_at DESC);

-- Enable Row Level Security
ALTER TABLE urgent_requirements ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read only active, non-expired requirements
CREATE POLICY "Public can view active urgent requirements"
ON urgent_requirements
FOR SELECT
TO public
USING (
    status = 'active' 
    AND (expires_at IS NULL OR expires_at > NOW())
);

-- Policy: Authenticated users with proper permissions can do everything
CREATE POLICY "Authenticated users can manage urgent requirements"
ON urgent_requirements
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create update trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_urgent_requirements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_urgent_requirements_updated_at
BEFORE UPDATE ON urgent_requirements
FOR EACH ROW
EXECUTE FUNCTION update_urgent_requirements_updated_at();

-- Grant permissions
GRANT SELECT ON urgent_requirements TO anon;
GRANT ALL ON urgent_requirements TO authenticated;
GRANT ALL ON urgent_requirements TO service_role;

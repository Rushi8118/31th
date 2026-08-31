-- ============================================================
-- SIDDHIVINAYAK OVERSEAS — DASHBOARD EXTRA SCHEMAS
-- Execute this script in the Supabase SQL Editor to enable
-- documents tracking, appointments calendars, and chat channels.
-- ============================================================

-- 1. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    application_id      UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    file_path           TEXT NOT NULL, -- Storage bucket path
    file_type           VARCHAR(50),
    file_size           INTEGER,
    status              VARCHAR(30) NOT NULL DEFAULT 'Uploaded' CHECK (status IN ('Uploaded', 'Missing', 'Rejected', 'Verified')),
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. APPOINTMENTS TABLE (if distinct from consultations)
CREATE TABLE IF NOT EXISTS public.appointments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    assigned_officer    UUID REFERENCES public.user_profiles(id),
    appointment_type    VARCHAR(50) NOT NULL CHECK (appointment_type IN ('Video Call', 'In-Person', 'Phone Call')),
    status              VARCHAR(30) NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    scheduled_at        TIMESTAMPTZ NOT NULL,
    duration_minutes    INTEGER DEFAULT 30,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MESSAGES (CHAT WITH CASE OFFICER) TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id           UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    receiver_id         UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    message             TEXT NOT NULL,
    file_url            TEXT,
    file_name           VARCHAR(255),
    is_read             BOOLEAN NOT NULL DEFAULT FALSE,
    read_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can manage own documents" ON public.documents
    FOR ALL USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Users can manage own appointments" ON public.appointments
    FOR ALL USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can read own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert own messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================================
-- AUTO UPDATE TIMESTAMPS TRIGGERS
-- ============================================================
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- GRANTS FOR CLIENT APPLICATIONS
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
